import type { JWTPayload } from "hono/utils/jwt/types"

export interface AuthUser {
	email: string
	name: string
	image: string
	provider: string
}
export type AuthUserWithId = AuthUser & { userId: string }

export interface AuthAccount {
	provider: "google" | "gihtub"
	providerAccountId: string
	accessToken: string
	refreshToken?: string
	expiresAt: number
	idToken: string
	scope: string
	tokenType: string
}

// Combined OAuth data returned from validateCallback
export interface OAuthCallbackResult {
	user: AuthUser
	account: AuthAccount
}

export interface OAuthProvider {
	getAuthURL: () => string
	validateCallback: (code: string, state: string) => Promise<OAuthCallbackResult>
	refreshAcessToken: (user: UserSession["user"]) => Promise<void>
}

// JWT
// - iat number (in seconds)
// - nbf number (in seconds)
// - exp number (in seconds)
export type AppJWTPayload = JWTPayload & { user: AuthUserWithId }

export type UserSession = {
	user: AuthUserWithId
	exp: JWTPayload["exp"]
	// iat?: JWTPayload["iat"] // maybe use omit
	// nbf?: JWTPayload["nbf"] // maybe use omit
}

export type GenerateTokenForSessionResult = {
	token: string
	expires: Date
}
