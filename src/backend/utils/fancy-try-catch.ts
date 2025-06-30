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
		return { data: data as D, error: null }
	} catch (error) {
		return { data: null, error: error as E }
	}
}
