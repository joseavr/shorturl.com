import type { MiddlewareHandler } from "hono"
import {
	revalidateSessionToken,
	verifyToken
} from "../../features/auth/services/artic/jwt"
import {
	getSessionTokenCookie,
	setSessionTokenCookie
} from "../../features/auth/services/artic/session"

export const authMiddleware: MiddlewareHandler = async (c, next) => {
	//
	// 1. Get and Verify the session JWT
	//
	const jwt = getSessionTokenCookie(c)
	if (!jwt) return c.json({ error: "UNAUTHORIZED: Token no valid" }, 401) // TODO redirect to login

	const { error, decodedToken } = await verifyToken(jwt)
	if (error) return c.json({ error: "UNAUTHORIZED: Token no valid" }, 401) // TODO redirect to login

	//
	// At this point, the JWT token has been verified.
	// We assume the user is valid and authorized
	// to access protected routes.
	//

	//
	// 2. Attach user info to context / request
	//
	c.set("user", {
		id: decodedToken.user.userId,
		name: decodedToken.user.name,
		image: decodedToken.user.image,
		email: decodedToken.user.email
	})

	//
	// 3. Re-issue JWT if about to expire (< 5 min left)
	//
	const { error: validationError, data } = await revalidateSessionToken(jwt)
	if (validationError) return c.json({ error: "UNAUTHORIZED: reIssueTokenError" }, 401) // TODO redirect to login

	// no data -> should not refreshToken
	if (data === null) return next()

	// data -> refreshed tokens then set to cookies
	setSessionTokenCookie(c, data.token, data.expires)

	return next()
}
