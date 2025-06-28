import { sign, verify } from "hono/jwt"
import { SignJwtError } from "./errors"

const secret = process.env.JWT_SECRET as string

export const createSessionCookie = async (userId: string, provider: string) => {
	const now = Math.floor(Date.now() / 1000)

	const payload = {
		sub: userId,
		provider: provider,
		iat: now, // Issued at time
		nbf: now, // Not valid before time
		exp: now + 60 * 60 * 24 * 7 // Expires in 7 days (matches cookie maxAge)
	}

	// HS256 accepts `secret` as any string
	// RS256 is more complicated for the secret
	const [error, token] = await sign(payload, secret, "HS256")
		.then((token) => [undefined, token])
		.catch((e) => [e, undefined])

	if (error) {
		throw new SignJwtError(
			"Could not sign the payload. Make sure you are passing the right secret for the algoirthm. Note: some algorithms needs the secret to be format in a specific way."
		)
	}

	return {
		name: "session-token",
		value: token,
		options: {
			httpOnly: true,
			secure: true,
			path: "/",
			sameSite: "Strict",
			maxAge: 60 * 60 * 24 * 7 // 7 days
		}
	}
}

export const getSessionUser = async (
	req: Request
): Promise<{
	userId: string
	provider: string
} | null> => {
	const cookie = req.headers.get("cookie")?.match(/session-token=([^;]+)/)
	if (!cookie) return null

	try {
		const decoded = await verify(cookie[1], secret)

		// TODO type with zod
		return {
			userId: decoded.sub as string,
			provider: decoded.provider as string
		}
	} catch (e) {
		console.error("Line 41 - jwt.ts: Failed to verify cookie:\n", e)
		return null
	}
}
