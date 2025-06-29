import type { MiddlewareHandler } from "hono"
import { reIssueToken, verifyToken } from "../auth/artic/jwt"
import { getSessionToken, setSessionTokenCookie } from "../auth/artic/session"

export const authMiddleware: MiddlewareHandler = async (c, next) => {
	// 1. Get and Verify the session JWT
	const jwt = getSessionToken(c)
	if (!jwt) return c.json({ error: "Unauthorized" }, 401) // TODO redirect to login

	const [error, decodedToken] = await verifyToken(jwt)
	if (error) return c.json({ error: "Unauthorized" }, 401) // TODO redirect to login

	//
	// At this point, the JWT token has been verified.
	// We assume the user is valid and authorize them
	// to access protected routes.
	//

	// 2. Attach user info to context / request
	c.set("user", {
		id: decodedToken.userId,
		name: decodedToken.name,
		image: decodedToken.image,
		email: decodedToken.email
	})

	// 3. Re-issue JWT if about to expire (< 5 min left)
	const [validationError, data] = await reIssueToken(jwt)
	if (validationError) return c.json({ error: "Unauthorized" }, 401) // TODO redirect to login

	// no data -> should not refreshToken
	if (data === null) return next()

	// data -> refreshed tokens then set to cookies
	setSessionTokenCookie(c, data.token, data.expires)

	return next()
}
