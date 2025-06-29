import { sign, verify } from "hono/jwt"
import type { SignatureAlgorithm } from "hono/utils/jwt/jwa"
import type { JWTPayload } from "hono/utils/jwt/types"
import { SignJwtError } from "./errors"
import type { AppJWTPayload } from "./types"

const secret = process.env.JWT_SECRET as string

export const signToken = async (
	payload: JWTPayload,
	alg: SignatureAlgorithm = "HS256"
) => {
	return (await sign(payload, secret, alg)
		.then((token) => [null, token])
		.catch((e) => [e, null])) as [Error, null] | [null, string]
}

export const verifyToken = async (token: string) => {
	return (await verify(token, secret)
		.then((decoded) => [null, decoded])
		.catch((e: Error) => [e, null])) as [Error, null] | [null, AppJWTPayload]
}

export const createSessionCookie = async (
	userId: string,
	email: string,
	provider: string
) => {
	const now = Math.floor(Date.now() / 1000)
	const exp = now + 60 * 60 * 24 * 7 // Expires in 7 days (matches cookie maxAge)

	const payload: AppJWTPayload = {
		sub: userId,
		provider: provider,
		email: email,
		// following 3 fields are needed for hono/jwt
		iat: now, // Issued at time
		nbf: now, // Not valid before time
		exp: exp // expires in 7 days
	}

	// HS256 accepts any string `secret`
	// RS256 is more complicated to get secret
	const [error, token] = await signToken(payload)

	if (error) {
		throw new SignJwtError(
			"Could not sign the payload. Make sure you are passing the right secret for the algorithm. Note: some algorithms needs the secret to be format in a specific way."
		)
	}

	// Returns all session cookie options including the jwt
	// to set in a cookie http-only
	return {
		name: "session-token",
		value: token,
		options: {
			httpOnly: true,
			secure: true,
			path: "/",
			sameSite: "Strict",
			maxAge: exp // 7 days
		}
	}
}

export const getSessionUser = async (
	req: Request
): Promise<{
	userId: string
	provider: string
} | null> => {
	const cookie = req.headers.get("Cookie")?.match(/session-token=([^;]+)/)
	if (!cookie) return null

	const [error, decoded] = await verifyToken(cookie[1])

	if (error) {
		return null
	}

	// TODO type with zod
	return {
		userId: decoded.sub,
		provider: decoded.provider
	}
}
