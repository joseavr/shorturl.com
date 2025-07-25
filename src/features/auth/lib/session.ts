import "server-only"
import type { Context } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { headers } from "next/headers"
import { cache } from "react"
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
		sameSite: "Lax",
		secure: process.env.NODE_ENV === "production",
		expires: new Date(expires),
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

export const getServerSession = async (req?: Request): GetServerSessionReturnType => {
	const cookie = req?.headers.get("cookie")?.match(/session-token=([^;]+)/)

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

export const getServerSessionCache = cache(
	async (req?: Request): GetServerSessionReturnType => {
		const headersList = req ? req.headers : await headers()

		const cookie = headersList.get("cookie")?.match(/session-token=([^;]+)/)

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
)
