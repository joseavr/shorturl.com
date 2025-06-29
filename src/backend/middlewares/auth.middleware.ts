import type { MiddlewareHandler } from "hono"
import { getCookie } from "hono/cookie"
import { createSessionCookie, verifyToken } from "../auth/artic/jwt"

export const authMiddleware: MiddlewareHandler = async (c, next) => {
	// 1. Get and Verify the session JWT
	const jwt = getCookie(c, "session-token")
	if (!jwt) return c.json({ error: "Unauthorized" }, 401) // TODO redirect to login

	const [error, payload] = await verifyToken(jwt)
	if (error) return c.json({ error: "Unauthorized" }, 401) // TODO redirect to login

	// 2. Attach user info to context / request
	c.set("user", { id: payload.sub, email: payload.email, provider: payload.provider })

	// 3. Re-issue JWT if about to expire (< 5 min left)
	const now = Math.floor(Date.now() / 1000)
	const exp = payload.exp
	const shouldRefreshJwt = exp && exp - now < 5 * 60

	if (shouldRefreshJwt) {
		// * this can throw SignJwtError
		const sessionCookie = await createSessionCookie(
			payload.sub,
			payload.email,
			payload.provider
		)

		c.header(
			"Set-Cookie",
			`${sessionCookie.name}=${sessionCookie.value}; Path=${sessionCookie.options.path}; HttpOnly; Max-Age=${sessionCookie.options.maxAge}; SameSite=${sessionCookie.options.sameSite}; Secure`
		)
	}

	return next()
}
