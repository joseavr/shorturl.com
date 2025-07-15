// Another way to create Custom Error Classes using a Factory
// Note: not sure 'instanceof' will work
// const createErrorFactory = (name: string) =>
// 	class BusinessError extends Error {
// 		constructor(message: string) {
// 			super(message)
// 			this.name = name
// 		}
// 	}

import * as arctic from "arctic"
import { DrizzleError } from "drizzle-orm"
import type { Context } from "hono"

export class StateOrVerifierError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "StateOrVerifierError"
	}
}

export class SignJwtError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "SignJwtError"
	}
}

export class OAuthParametersError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "OAuthParametersError"
	}
}

export class RefreshTokenError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "RefreshTokenError"
	}
}

export function handleError(e: unknown, c: Context) {
	if (e instanceof arctic.OAuth2RequestError) {
		return c.json({ error: e.name, message: e.message })
	}

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
		return c.json({ error: e.name, message: e.message }, 400)
	}

	if (e instanceof RefreshTokenError) {
		return c.json({ error: e.name, message: e.message }, 400)
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
