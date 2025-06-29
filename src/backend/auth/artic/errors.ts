// Another way to create Custom Error Classes using a Factory
// Note: not sure 'instanceof' will work
// const createErrorFactory = (name: string) =>
// 	class BusinessError extends Error {
// 		constructor(message: string) {
// 			super(message)
// 			this.name = name
// 		}
// 	}

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
