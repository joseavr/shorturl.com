import type { JWTPayload } from "hono/utils/jwt/types"

export interface OAuthUser {
	email: string
	name?: string
	picture?: string
}

export interface OAuthAccount {
	provider: string
	providerAccountId: string
	accessToken: string
	refreshToken?: string
	expiresAt: number
	idToken: string
	scope: string
	tokenType: string
}

export interface OAuthProvider {
	getAuthURL: () => string
	validateCallback: (code: string, state: string) => Promise<OAuthUser & OAuthAccount>
	refreshAcessToken: (session: { userId: string; provider: string }) => Promise<void>
}

// 'type' shows you the fields on hover
// while 'interface' does not
export type AppJWTPayload = JWTPayload & {
	sub: string
	email: string
	provider: string
}
