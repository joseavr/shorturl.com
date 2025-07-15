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

/**
 * JWT
 * - iat number (in seconds)
 * - nbf number (in seconds)
 * - exp number (in seconds)
 */
export type AppJWTPayload = JWTPayload & { user: AuthUserWithId }

export type GetServerSessionReturnType = Promise<
	| {
			isAuthenticated: false
			getUser: null
			getAcessToken: null
	  }
	| {
			isAuthenticated: true
			getUser: () => AuthUserWithId
			getAcessToken: () => AppJWTPayload
	  }
>
