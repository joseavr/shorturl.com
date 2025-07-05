import { Hono } from "hono"
import { deleteCookie } from "hono/cookie"
import { OAuthParametersError } from "@/backend/auth/artic/errors"
import { GoogleProvider } from "@/backend/auth/artic/google.provider"
import {
	clearUserAcessTokenDB,
	findOrCreateUserByProviderAccount
} from "@/backend/auth/artic/helpers"
import {
	generateTokenForSession,
	getUserSession,
	setSessionTokenCookie
} from "@/backend/auth/artic/session"
import { handleError } from "@/backend/utils/handle-error"

const authRoute = new Hono()

// Start Google OAuth
authRoute.get("/google", (c) => {
	const authUrl = GoogleProvider.getAuthURL()
	console.log(authUrl)

	return c.redirect(`${authUrl}`)
})

// Google OAuth callback
authRoute.get("/google/callback", async (c) => {
	const { searchParams } = new URL(c.req.url)

	// "code" and "state" found in the searchParams sent by Google.
	// which are required for exchanging with Google's access_token.
	const code = searchParams.get("code")
	const state = searchParams.get("state")

	try {
		if (!code || !state) throw new OAuthParametersError("Missing / invalid code or state")

		const result = await GoogleProvider.validateCallback(code, state)

		const user = await findOrCreateUserByProviderAccount(result.user, result.account)

		const { token, expires } = await generateTokenForSession(user)

		// Use """JWT Session Strategy""" by storing the JWT in an HTTP-only cookie
		setSessionTokenCookie(c, token, expires)

		// TODO login success, then redirect to protected route.
		return c.json({ message: "Login successful", user }, 200)
	} catch (e) {
		handleError(e, c)
	}
})

// Refresh Token Rotation
authRoute.get("/refresh_token", async (c) => {
	const session = await getUserSession(c.req.raw)

	if (!session)
		return c.json({ error: "UNAUTHORIZED", message: "Token missing or invalid" }, 401)

	// Fetch refresh token from `accounts` table and
	// call `refreshAccessToken(userId)`
	// Save new tokens to DB
	await GoogleProvider.refreshAcessToken(session.user)

	return c.json({ message: "Tokens refreshed" }, 200)
})

authRoute.get("/logout", async (c) => {
	const session = await getUserSession(c.req.raw)

	if (!session)
		return c.json({ error: "UNAUTHORIZED", message: "Token missing or invalid" })

	// Invalidate session by clearing the session-token cookie
	deleteCookie(c, "session_token")

	// Invalidate google access_token
	GoogleProvider.invalidateAcessToken(session.user)

	// Clear user access_token in DB
	clearUserAcessTokenDB(session.user)

	return c.json({ message: "Logout successful" }, 200)
})

export { authRoute }
