type Success<D> = {
	data: D
	error: null
}

type Failure<E> = {
	data: null
	error: E
}

type Result<D, E = Error> = Success<D> | Failure<E>

// only caveat, we cannot add a message to our CustomError
export async function tryCatch<D, E = Error>(promise: Promise<D>): Promise<Result<D, E>> {
	try {
		const data = await promise
		return { data: data, error: null }
	} catch (error) {
		return { data: null, error: error as E }
	}
}

// Golang-like handle errors
export async function safeAwait<T, E = Error>(
	promise: Promise<T>
): Promise<[null, T] | [E, null]> {
	try {
		const result = await promise
		return [null, result]
	} catch (error) {
		return [error as E, null]
	}
}
