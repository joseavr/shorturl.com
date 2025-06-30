import type { Context } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { SignJwtError } from "./errors"
import { signToken, verifyToken } from "./jwt"
import type {
	AppJWTPayload,
	AuthUserWithId,
	GenerateTokenForSessionResult,
	UserSession
} from "./types"

const SESSION_COOKIE_NAME = "session-token"
const EXPIRES_IN_MS = 60 * 60 * 24 * 7 * 1000 // Expires in 7 days in miliseconds (matches cookie's maxAge)

export const generateTokenForSession = async (
	payload: AuthUserWithId
): Promise<GenerateTokenForSessionResult> => {
	//
	// 1. Create payload
	//
	const now = Math.floor(Date.now()) // now in miliseconds
	const exp = now + EXPIRES_IN_MS // Expires in 7 days in miliseconds (matches cookie's expires)
	const jwtPayload: AppJWTPayload = {
		user: payload,
		// following 3 fields are needed for hono/jwt
		iat: now / 1000, // (in seconds) Issued at time
		nbf: now / 1000, // (in seconds) Not valid before time
		exp: exp / 1000 // (in seconds) expires in 7 days
	}

	//
	// 2. Sign payload and generate JWT token
	//
	const { error, jwt } = await signToken(jwtPayload)

	if (error) {
		throw new SignJwtError(
			"Could not sign the payload. Make sure you are passing the right secret for the algorithm. Note: some algorithms needs the secret to be format in a specific way."
		)
	}

	//
	// 3. Return token with the http-only cookie options
	//
	return {
		token: jwt,
		// jwt and cookie have the same expiration
		expires: new Date(exp) // Date accepts miliseconds
	}
}

export const setSessionTokenCookie = (c: Context, token: string, expires: Date) => {
	// using the hono api to set cookies
	setCookie(c, SESSION_COOKIE_NAME, token, {
		expires: expires,
		sameSite: "Strict",
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true
	})
}

export const deleteSessionTokenCookie = (c: Context) => {
	deleteCookie(c, SESSION_COOKIE_NAME, {
		httpOnly: true,
		sameSite: "Strict",
		secure: process.env.NODE_ENV === "production",
		maxAge: 0,
		path: "/"
	})
}

export const getSessionTokenCookie = (c: Context) => {
	return getCookie(c, SESSION_COOKIE_NAME)
}

export const getSessionUser = async (req: Request): Promise<UserSession | null> => {
	const cookie = req.headers.get("Cookie")?.match(/session-token=([^;]+)/)
	if (!cookie) return null

	const [_fullMatch, jwt] = cookie
	const { error, decodedToken } = await verifyToken(jwt)

	if (error) return null

	return decodedToken as UserSession
}

export const useUser = async () => {}
