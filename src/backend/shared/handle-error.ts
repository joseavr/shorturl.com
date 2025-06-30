import { DrizzleError } from "drizzle-orm"
import type { Context } from "hono"
import {
	OAuthParametersError,
	RefreshTokenError,
	SignJwtError,
	StateOrVerifierError
} from "../auth/artic/errors"

export function handleError(e: unknown, c: Context) {
	if (e instanceof DrizzleError) {
		return c.json({ error: e.name, message: e.message }, 500)
	}

	if (e instanceof SignJwtError) {
		return c.json({ error: e.name, message: e.message }, 500)
	}

	if (e instanceof OAuthParametersError) {
		return c.json({ error: e.name, message: e.message }, 400)
	}

	if (e instanceof StateOrVerifierError) {
		return c.json({ error: e.name, message: e.message })
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
