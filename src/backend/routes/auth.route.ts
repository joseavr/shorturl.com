import { Hono } from "hono"
import { GoogleProvider } from "@/backend/auth/artic/google.provider"
import { OAuthParametersError } from "../auth/artic/errors"
import { findOrCreateUserByProviderAccount } from "../auth/artic/helpers"
import {
	generateTokenForSession,
	getSessionUser,
	setSessionTokenCookie
} from "../auth/artic/session"
import { handleError } from "../shared/handle-error"

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
authRoute.get("/api/auth/refresh", async (c) => {
	const session = await getSessionUser(c.req.raw)

	if (!session)
		return c.json({ error: "UnAuthorized", message: "Token missing or invalid" }, 401)

	// Fetch refresh token from `accounts` table and
	// call `refreshAccessToken(userId)`
	// Save new tokens to DB
	await GoogleProvider.refreshAcessToken(session)

	return c.json({ message: "Tokens refreshed" }, 200)
})

export { authRoute }
