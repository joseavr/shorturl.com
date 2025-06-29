import { DrizzleError } from "drizzle-orm"
import { Hono } from "hono"
import { setCookie } from "hono/cookie"
import { GoogleProvider } from "@/backend/auth/artic/google.provider"
import { OAuthParametersError, SignJwtError } from "../auth/artic/errors"
import { findOrCreateUserByProviderAccount } from "../auth/artic/helpers"
import { createSessionCookie, getSessionUser } from "../auth/artic/jwt"

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
	// which are required for exchanging.
	const code = searchParams.get("code")
	const state = searchParams.get("state")

	try {
		if (!code || !state) throw new OAuthParametersError("Missing / invalid code or state")

		const result = await GoogleProvider.validateCallback(code, state)

		const user = await findOrCreateUserByProviderAccount(result.user, result.account)

		const sessionCookie = await createSessionCookie(user.id, user.email, "google")

		// Use JWT Session Strategy by storing the JWT in an HTTP-only cookie
		setCookie(c, sessionCookie.name, sessionCookie.value, {
			path: sessionCookie.options.path,
			httpOnly: true,
			maxAge: sessionCookie.options.maxAge,
			sameSite: sessionCookie.options.sameSite as "Strict",
			secure: sessionCookie.options.secure
		})

		// TODO login success, then redirect to protected route.
		return c.json({ message: "Login successful", user }, 200)
	} catch (e) {
		if (e instanceof DrizzleError) {
			return c.json(
				{
					error: e.name,
					message: e.message
				},
				500
			)
		}

		if (e instanceof SignJwtError) {
			return c.json(
				{
					error: e.name,
					message: e.message
				},
				500
			)
		}

		if (e instanceof OAuthParametersError) {
			return c.json(
				{
					error: e.name,
					message: e.message
				},
				400
			)
		}

		console.error({
			error: "\n\nUnkown Internal Server Error:\n",
			stack: (e as Error).stack
		})

		return c.json(
			{
				error: "Unkown Internal Server Error",
				message: "An unexpected error occurred during authentication"
			},
			500
		)
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
