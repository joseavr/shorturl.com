/** biome-ignore-all lint/style/noNonNullAssertion: only for process.env until Implement .env with zod */
import * as arctic from "arctic"
import { and, eq } from "drizzle-orm"
import type { Context } from "hono"
import { getCookie } from "hono/cookie"
import { db } from "@/database"
import { accountTable } from "@/database/drizzle/schemas"
import { RefreshTokenError, StateOrVerifierError } from "../../server/errors"
import type { AuthAccount, AuthUser, AuthUserWithId } from "../../types"
import type { GoogleClaims } from "./type"

/**
 * Google OAuth2.0 Provider class for handling authentication with Google services.
 *
 * This class manages the complete OAuth2.0 flow including:
 * - Authorization URL generation
 * - Callback validation and token exchange
 * - Access token refresh
 * - Token revocation
 *
 * Uses the Arctic library for OAuth2.0 implementation and Drizzle ORM for database operations.
 */
class GoogleProviderClass {
	/** Google OAuth2.0 client ID from environment variables */
	private clientId: string
	/** Google OAuth2.0 client secret from environment variables */
	private clientSecret: string
	/** OAuth2.0 redirect URI for callback handling */
	private redirectUri: string
	/** Arctic Google OAuth2.0 client instance */
	public google: arctic.Google

	constructor() {
		this.clientId = process.env.GOOGLE_CLIENT_ID!
		this.clientSecret = process.env.GOOGLE_CLIENT_SECRET!
		this.redirectUri = process.env.GOOGLE_REDIRECT_URI!
		this.google = new arctic.Google(this.clientId, this.clientSecret, this.redirectUri)
	}

	generateStateAndVerifier() {
		const state = arctic.generateState()
		const codeVerifier = arctic.generateCodeVerifier()

		return {
			state,
			codeVerifier
		}
	}

	/**
	 * Constructs the authorization URL for Google OAuth2.0 authentication.
	 *
	 * This method generates a secure authorization URL that let users begin
	 * the OAuth2.0 flow. It includes:
	 * - `state` State parameter for CSRF protection
	 * - `codeVerifier` Used to verify the authorization code
	 * - `scopes` Options to gain access user information
	 * - `access_type: offline` To get refresh tokens without requiring the user to re-authenticate
	 *
	 */
	getAuthURL(state: string, codeVerifier: string) {
		const scopes = ["openid", "profile", "email"]
		const url = this.google.createAuthorizationURL(state, codeVerifier, scopes)

		url.searchParams.set("access_type", "offline")

		return url.toString()
	}

	/**
	 *
	 * After user log-in, Google sends via searchParams the `state` and authorization `code`
	 *
	 * This metehod implements PKCE (Proof Key for Code Exchange) flow. The flow is as follows:
	 * 1. Our app genererates and sends `code` and `codeVerifier` to Google
	 * 2. Google stores the 'codeVerifier'
	 * 3. Google sends back the 'state' string via searchParams to our app.
	 * 4. Using the 'state', our app must retrieve 'codeVerifier' and send it when exchaning 'code' for tokens.
	 *
	 * @param {string} code - The authorization code returned by Google via searchParams to exchange for:
	 * 	- Access Token: A token that gives authorization on retrieving user data in Google.
	 * 	- ID Token: A token containing user identity information, such as email and name.
	 * 	- Refresh Token: A token to refresh the `access_token`
	 *
	 * @param {string} state - The `state` parameter returned by Google via searchParams for CSRF protection.
	 *
	 * @throws {StateOrVerifierError} If the state parameter is invalid or missing
	 * @throws {Error} If token exchange fails
	 *
	 */
	async validateCallback(
		c: Context,
		code: string,
		state: string
	): Promise<{ user: AuthUser; account: AuthAccount }> {
		const verifier = getCookie(c, state)

		if (!verifier) throw new StateOrVerifierError("Invalid state or verifier")

		// Exchange 'code' for token
		const tokens = await this.google.validateAuthorizationCode(code, verifier)

		// Decode id_token to get user basic information
		const claims = arctic.decodeIdToken(tokens.idToken()) as GoogleClaims

		const user: AuthUser = {
			email: claims.email,
			name: claims.name,
			image: claims.picture,
			provider: "google"
		}

		const account: AuthAccount = {
			provider: "google",
			providerAccountId: claims.sub,
			accessToken: tokens.accessToken(),
			refreshToken: tokens.hasRefreshToken() ? tokens.refreshToken() : undefined,
			expiresAt: Number(tokens.accessTokenExpiresAt()),
			idToken: tokens.idToken(),
			scope: tokens.scopes().toString(),
			tokenType: tokens.tokenType()
		}

		return {
			user,
			account
		}
	}

	/**
	 * Refreshes an expired access token using the stored refresh token.
	 *
	 * This method should be used when an access token has expired and a new one
	 * is needed. It checks if the current token is still valid before attempting
	 * to refresh it. The new tokens are automatically saved to the database.
	 *
	 * ⚠️ **Important**: Do not use this method in middleware as it
	 * requires database access, which defeats the purpose of stateless authentication.
	 *
	 * @param {string} userId - The user Id
	 * @returns {Promise<void>} Resolves when token refresh is complete
	 *
	 * @throws {RefreshTokenError} If refresh token is missing or invalid
	 * @throws {Error} If database operations fail
	 *
	 */
	async refreshAcessToken(userId: string): Promise<void> {
		// Find `refreshToken` from `accounts` table
		// by the userID and provider="google"
		const account = await db
			.select({
				refreshToken: accountTable.refresh_token,
				expiresAt: accountTable.expires_at
			})
			.from(accountTable)
			.where(and(eq(accountTable.userId, userId), eq(accountTable.provider, "google")))
			.limit(1)
			.then((arr) => arr[0])

		if (!account.refreshToken || !account.expiresAt)
			throw new RefreshTokenError("Missing Refresh Token or expiration")

		// if provider token still valid then early return
		// Note: expiresAt from accountTable is in miliseconds
		if (account.expiresAt > Date.now()) return

		// otherwise continue refreshToken process
		const tokens = await this.google.refreshAccessToken(account.refreshToken)
		if (!tokens) throw new RefreshTokenError("Google could not exchange this token.")

		// Save new tokens to db
		await db
			.update(accountTable)
			.set({
				access_token: tokens.accessToken(),
				expires_at: Number(tokens.accessTokenExpiresAt()),
				refresh_token: tokens.hasRefreshToken()
					? tokens.refreshToken()
					: account.refreshToken
			})
			.where(and(eq(accountTable.userId, userId), eq(accountTable.provider, "google")))
	}

	/**
	 * Invalidates and revokes an access token from Google's servers.
	 *
	 * This method revokes the access token on Google's side, making it unusable
	 * for future API calls. This is typically used during logout or when
	 * revoking user access to the application.
	 *
	 * Use Cases:
	 * - When the user logs out
	 *
	 * @param {AuthUserWithId} user - The user session containing userId and provider
	 * @returns {Promise<void>} Resolves when token revocation is complete
	 *
	 * @throws {Error} If no access token is found or revocation fails
	 *
	 */
	async invalidateAcessToken(userId: string): Promise<void> {
		// Find the account to get the access token
		const account = await db
			.select({
				accessToken: accountTable.access_token
			})
			.from(accountTable)
			.where(and(eq(accountTable.userId, userId), eq(accountTable.provider, "google")))
			.limit(1)
			.then((arr) => arr[0])

		if (!account.accessToken) {
			throw new Error("No access token found to invalidate")
		}

		// Revoke the access token in Google
		await this.google.revokeToken(account.accessToken)

		// Also clear the token from the database
	}
}

export const GoogleProvider = new GoogleProviderClass()
