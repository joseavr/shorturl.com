import { sign, verify } from "hono/jwt"
import type { SignatureAlgorithm } from "hono/utils/jwt/jwa"
import { generateTokenForSession } from "./session"
import type { AppJWTPayload } from "./types"

const secret = process.env.JWT_SECRET as string

export const signToken = async (
	payload: AppJWTPayload,
	alg: SignatureAlgorithm = "HS256"
) => {
	// HS256 accepts any string `secret`
	// RS256 is more complicated to get secret
	return await sign(payload, secret, alg)
		.then((jwt) => ({ error: null, jwt }))
		.catch((error: Error) => ({ error, jwt: null }))
}

export const verifyToken = async (token: string) => {
	return (await verify(token, secret)
		.then((decodedToken) => ({ error: null, decodedToken }))
		.catch((error: Error) => ({ error, decodedToken: null }))) as
		| { error: null; decodedToken: AppJWTPayload }
		| { error: Error; decodedToken: null }
}

export const revalidateSessionToken = async (token: string) => {
	const { error, decodedToken } = await verifyToken(token)
	if (error) return { error, data: null }

	// Re-issue JWT if about to expire (< 5 min left)
	const now = Math.floor(Date.now() / 1000)
	const exp = decodedToken.exp
	const shouldRefreshJwt = exp && exp - now < 5 * 60 // if < 5 min left

	if (!shouldRefreshJwt) return { error: null, data: null }

	// ? this can throw SignJwtError
	const { token: newJwtToken, expires } = await generateTokenForSession({
		userId: decodedToken.user.userId,
		name: decodedToken.user.name,
		email: decodedToken.user.email,
		provider: decodedToken.user.provider,
		image: decodedToken.user.image
	})

	return { error: null, data: { token: newJwtToken, expires } }
}
