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
	refreshAcessToken: (session: { userId: string; provider: string }) => Promise<{
		accessToken: string
		expiresAt: number
		refreshToken: string
	}>
}
