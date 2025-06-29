import { sign, verify } from "hono/jwt"
import type { SignatureAlgorithm } from "hono/utils/jwt/jwa"
import type { JWTPayload } from "hono/utils/jwt/types"
import { generateTokenForSession } from "./session"
import type { AppJWTPayload } from "./types"

const secret = process.env.JWT_SECRET as string

export const signToken = async (
	payload: JWTPayload,
	alg: SignatureAlgorithm = "HS256"
) => {
	// HS256 accepts any string `secret`
	// RS256 is more complicated to get secret
	return (await sign(payload, secret, alg)
		.then((token) => [null, token])
		.catch((e) => [e, null])) as [Error, null] | [null, string]
}

export const verifyToken = async (token: string) => {
	return (await verify(token, secret)
		.then((decoded) => [null, decoded])
		.catch((e: Error) => [e, null])) as [Error, null] | [null, AppJWTPayload]
}

export const reIssueToken = async (
	token: string
): Promise<[Error, null] | [null, null] | [null, { token: string; expires: Date }]> => {
	const [error, decodedToken] = await verifyToken(token)
	if (error) return [error, null]

	// Re-issue JWT if about to expire (< 5 min left)
	const now = Math.floor(Date.now() / 1000)
	const exp = decodedToken.exp
	const shouldRefreshJwt = exp && exp - now < 5 * 60 // if < 5 min left

	if (!shouldRefreshJwt) return [null, null]

	// ? this can throw SignJwtError
	const { token: newJwtToken, expires } = await generateTokenForSession({
		userId: decodedToken.userId,
		name: decodedToken.name,
		email: decodedToken.email,
		provider: decodedToken.provider,
		image: decodedToken.image
	})

	return [null, { token: newJwtToken, expires }]
}
