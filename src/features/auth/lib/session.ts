import "server-only"
import type { Context } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import type { GetServerSessionReturnType } from "../types"
import { verifyToken } from "./jwt"

const SESSION_COOKIE_NAME = "session-token"

export const getSessionTokenCookie = (c: Context) => {
	return getCookie(c, SESSION_COOKIE_NAME)
}

export const setSessionTokenCookie = (c: Context, token: string, expires: Date) => {
	// using the hono api to set cookies
	setCookie(c, SESSION_COOKIE_NAME, token, {
		httpOnly: true,
		sameSite: "Strict",
		secure: process.env.NODE_ENV === "production",
		expires: expires,
		path: "/"
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

export const getServerSession = async (req: Request): GetServerSessionReturnType => {
	const cookie = req.headers.get("cookie")?.match(/session-token=([^;]+)/)
	if (!cookie) {
		return {
			isAuthenticated: false,
			getUser: null,
			getAcessToken: null
		}
	}

	const jwt = cookie[1]
	const { error, decodedToken } = await verifyToken(jwt)

	if (error) {
		return {
			isAuthenticated: false,
			getUser: null,
			getAcessToken: null
		}
	}
	return {
		isAuthenticated: true,
		getUser: () => decodedToken.user,
		getAcessToken: () => decodedToken
	}
}
