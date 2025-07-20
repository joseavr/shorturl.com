import { sign, verify } from "hono/jwt"
import type { SignatureAlgorithm } from "hono/utils/jwt/jwa"
import { SignJwtError } from "../server/errors"
import type { AppJWTPayload, AuthUserWithId } from "../types"

const secret = process.env.JWT_SECRET as string
const EXPIRES_IN_MS = 1000 * 60 * 60 * 24 * 7 // Expires in 7 days in miliseconds (matches cookie's maxAge)

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

export const generateJWTForSession = async (
	payload: AuthUserWithId
): Promise<{
	jwt: string
	expires: Date
}> => {
	//
	// 1. Create payload
	//
	const now = Date.now() // now in miliseconds
	const exp = now + EXPIRES_IN_MS // Expires in 7 days in miliseconds (matches cookie's expires)
	const jwtPayload: AppJWTPayload = {
		user: payload,
		// following 3 fields are needed for hono/jwt
		iat: Math.floor(now / 1000), // (in seconds) Issued at time
		nbf: Math.floor(now / 1000), // (in seconds) Not valid before time
		exp: Math.floor(exp / 1000) // (in seconds) expires in 7 days
	}

	//
	// 2. Sign payload and generate JWT token
	//
	const { error, jwt } = await signToken(jwtPayload)

	if (error) {
		throw new SignJwtError(
			"Could not sign the payload. Make sure you are passing the right secret for the algorithm. Note: some algorithms needs the secret to be format in a specific way."
		)
	}

	//
	// 3. Return token with the http-only cookie options
	//
	return {
		jwt: jwt,
		// jwt and cookie have the same expiration
		expires: new Date(exp) // Date accepts miliseconds
	}
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
	const { jwt: newJwtToken, expires } = await generateJWTForSession({
		userId: decodedToken.user.userId,
		name: decodedToken.user.name,
		email: decodedToken.user.email,
		provider: decodedToken.user.provider,
		image: decodedToken.user.image
	})

	return { error: null, data: { token: newJwtToken, expires } }
}
