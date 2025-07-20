import { Hono } from "hono"
import { setCookie } from "hono/cookie"
import { redirect } from "next/navigation"
import { appUrl, isDev } from "@/const"
import {
	deleteSessionTokenCookie,
	getServerSession,
	setSessionTokenCookie
} from "@/features/auth/lib/session"
import { handleError, OAuthParametersError } from "@/features/auth/server/errors"
import { GoogleProvider } from "@/features/auth/services/artic/google.provider"
import { generateJWTForSession } from "../lib/jwt"
import { clearUserAcessTokenDB, findOrCreateUser } from "./db"

const authRoute = new Hono()

/**
 * Start Google OAuth
 */
authRoute.get("/google", (c) => {
	const { state, codeVerifier } = GoogleProvider.generateStateAndVerifier()

	const authUrl = GoogleProvider.getAuthURL(state, codeVerifier)

	setCookie(c, state, codeVerifier, {
		httpOnly: true,
		sameSite: "Lax", // changed from "Strict" to "Lax" for OAuth flow
		secure: process.env.NODE_ENV === "production",
		expires: new Date(Date.now() + 1000 * 60 * 3), // only 3m for login process
		path: "/"
	})

	return c.redirect(authUrl)
})

/**
 * Google OAuth callback
 */
authRoute.get("/google/callback", async (c) => {
	const { searchParams } = new URL(c.req.url)

	// "code" and "state" found in the searchParams sent by Google.
	// which are required for exchanging with Google's access_token.
	const code = searchParams.get("code")
	const state = searchParams.get("state")

	try {
		if (!code || !state) throw new OAuthParametersError("Missing / invalid code or state")

		const result = await GoogleProvider.validateCallback(c, code, state)

		const user = await findOrCreateUser(result.user, result.account)

		const { jwt, expires } = await generateJWTForSession(user)

		// Use `JWT Session Strategy` by storing the JWT in an HTTP-only cookie
		setSessionTokenCookie(c, jwt, expires)

		isDev && console.log({ message: "Login successful", user })
		return redirect(`${appUrl}/dashboard`)
	} catch (error) {
		return handleError(error, c)
	}
})

/**
 * Refresh Token Rotation
 */
authRoute.get("/refresh_token", async (c) => {
	const { isAuthenticated, getUser } = await getServerSession(c.req.raw)

	if (!isAuthenticated)
		return c.json({ error: "UNAUTHORIZED", message: "Token missing or invalid" }, 401)

	const currentUser = getUser()

	// Fetch refresh token from `accounts` table and
	// call `refreshAccessToken(userId)`
	// Save new tokens to DB
	await GoogleProvider.refreshAcessToken(currentUser.userId)

	return c.json({ message: "Tokens refreshed" }, 200)
})

/**
 * Logout user
 */
authRoute.post("/logout", async (c) => {
	const { isAuthenticated, getUser } = await getServerSession(c.req.raw)

	if (!isAuthenticated)
		return c.json({ error: "UNAUTHORIZED", message: "Token missing or invalid" })

	const currentUser = getUser()

	// Invalidate session by clearing the session-token cookie
	deleteSessionTokenCookie(c)

	try {
		// Invalidate google access_token
		await GoogleProvider.invalidateAcessToken(currentUser.userId)

		// Clear user access_token in DB
		clearUserAcessTokenDB(currentUser)

		return c.json({ message: "Logout successful" }, 200)
	} catch (error) {
		handleError(error, c)
	}
})

export { authRoute }
