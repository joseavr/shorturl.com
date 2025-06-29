import type { JWTPayload } from "hono/utils/jwt/types"

export interface AuthUser {
	id?: string
	email: string
	name: string
	image: string
}

export type AuthUserWithId = AuthUser & { id: string }

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
	refreshAcessToken: (session: AppJWTPayload) => Promise<void>
}

// 'type' shows you the fields on hover
// while 'interface' does not
export type AppJWTPayload = JWTPayload & {
	userId: string
	email: string
	provider: string
}

export type SessionCookieOptions = {
	name: string
	value: string
	options: {
		httpOnly: boolean
		secure: boolean
		path: string
		sameSite: string
		maxAge: number
	}
}
