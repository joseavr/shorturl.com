import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { db } from "@/database"
import { urlTable } from "@/database/drizzle/schemas"
import { getServerSession } from "@/features/auth/lib/session"
import type { AppRouteHandler } from "@/lib/types"
import { onFailureResponse, onSuccessResponse } from "@/utils/http-response-factory"
import * as HttpsCode from "@/utils/http-status-codes"
import { createRateLimiter } from "@/utils/ratelimiter"
import type {
	deletePrivateRoute,
	getAllPrivateRoute,
	getAllPublicRoute,
	patchPrivateRoute,
	postPrivateRoute,
	postPublicRoute
} from "./urls.docs"

export const getAllPublic: AppRouteHandler<getAllPublicRoute> = async (c) => {
	const urls = await db.query.urlTable.findMany({
		where: eq(urlTable.visibility, "public"),
		with: {
			urlClicks: true
		}
	})

	const urlsWithClicksCount = urls.map(({ urlClicks, ...url }) => ({
		...url,
		clicksCount: urlClicks.length
	}))

	return c.json(onSuccessResponse(urlsWithClicksCount), HttpsCode.OK)
}

export const getAllPrivate: AppRouteHandler<getAllPrivateRoute> = async (c) => {
	const { isAuthenticated, getUser } = await getServerSession(c.req.raw)

	if (!isAuthenticated) {
		return c.json(
			onFailureResponse("UNAUTHORIZED", "Not authorized to make this request."),
			HttpsCode.UNAUTHORIZED
		)
	}

	const currentUser = getUser()

	const urls = await db.query.urlTable.findMany({
		where: eq(urlTable.ownerId, currentUser.userId),
		with: {
			urlClicks: true
		}
	})

	const urlsWithClicksCount = urls.map(({ urlClicks, ...url }) => ({
		...url,
		clicksCount: urlClicks.length
	}))

	return c.json(onSuccessResponse(urlsWithClicksCount), 200)
}

export const postPrivate: AppRouteHandler<postPrivateRoute> = async (c) => {
	// authentication
	const { isAuthenticated, getUser } = await getServerSession(c.req.raw)

	if (!isAuthenticated) {
		return c.json(
			onFailureResponse("UNAUTHORIZED", "Not authorized to make this request."),
			HttpsCode.UNAUTHORIZED
		)
	}

	const currentUser = getUser()

	const url = c.req.valid("json")

	// create shortUrl
	const shortUrl = nanoid(8)

	const [newUrl] = await db
		.insert(urlTable)
		.values({ ...url, shortUrl, ownerId: currentUser.userId })
		.returning()

	return c.json(onSuccessResponse(newUrl), 200)
}

export const postPublic: AppRouteHandler<postPublicRoute> = async (c) => {
	{
		// Rate limit: 3 requests per day per IP
		const ip =
			c.req.header("x-forwarded-for")?.split(",")[0] ||
			c.req.raw.headers.get?.("x-real-ip") ||
			"unknown"
		const ratelimiter = createRateLimiter(3, "1 d")
		const { success, limit, remaining, reset } = await ratelimiter.limit(ip)
		if (!success) {
			return c.json(
				onFailureResponse(
					"TOO_MANY_REQUESTS",
					"Too many requests. Please try again later."
				),
				HttpsCode.TOO_MANY_REQUESTS,
				{
					"X-RateLimit-Limit": limit.toString(),
					"X-RateLimit-Remaining": remaining.toString(),
					"X-RateLimit-Reset": reset.toString()
				}
			)
		}

		const url = c.req.valid("json")
		const shortUrl = nanoid(8)

		const [newUrl] = await db
			.insert(urlTable)
			.values({ originalUrl: url.originalUrl, shortUrl, visibility: "public" })
			.returning()

		return c.json(onSuccessResponse(newUrl), 200)
	}
}

export const patchPrivate: AppRouteHandler<patchPrivateRoute> = async (c) => {
	const { isAuthenticated, getUser } = await getServerSession(c.req.raw)

	if (!isAuthenticated) {
		return c.json(
			onFailureResponse("UNAUTHORIZED", "Not authorized to make this request."),
			HttpsCode.UNAUTHORIZED
		)
	}

	const currentUser = getUser()

	// get url by id and check if exist in db
	const urlId = c.req.param("urlId")
	const url = await db.query.urlTable.findFirst({
		where: eq(urlTable.id, urlId)
	})

	if (!url)
		return c.json(
			onFailureResponse("NOT_FOUND", "Could not find the URL in our server."),
			HttpsCode.NOT_FOUND
		)

	// check if user owns this url
	if (url.ownerId !== currentUser.userId)
		return c.json(
			onFailureResponse("UNAUTHORIZED", "Not authorized to make this request."),
			HttpsCode.UNAUTHORIZED
		)

	// edit the url
	const urlToUpdate = c.req.valid("json")

	// if url is same, only update visiblity
	if (urlToUpdate?.originalUrl === url.originalUrl) {
		const [urlUpdated] = await db
			.update(urlTable)
			.set({ visibility: urlToUpdate.visibility })
			.where(eq(urlTable.id, url.id))
			.returning()
		return c.json(onSuccessResponse(urlUpdated), 200)
	}

	// otherwise update url + shortUrl
	const newShortUrl = nanoid(8)

	const [urlUpdated] = await db
		.update(urlTable)
		.set({
			originalUrl: urlToUpdate.originalUrl,
			shortUrl: newShortUrl,
			visibility: urlToUpdate.visibility
		})
		.where(eq(urlTable.id, url.id))
		.returning()

	return c.json(onSuccessResponse(urlUpdated), 200)
}

export const deletePrivate: AppRouteHandler<deletePrivateRoute> = async (c) => {
	const { isAuthenticated, getUser } = await getServerSession(c.req.raw)

	if (!isAuthenticated) {
		return c.json(
			onFailureResponse("UNAUTHORIZED", "Not authorized to make this request."),
			HttpsCode.UNAUTHORIZED
		)
	}

	const currentUser = getUser()

	// get url by id and check if exist in db
	const urlId = c.req.param("urlId")
	const url = await db.query.urlTable.findFirst({
		where: eq(urlTable.id, urlId)
	})

	if (!url)
		return c.json(
			onFailureResponse("NOT_FOUND", "Could not find the URL in our servers."),
			HttpsCode.NOT_FOUND
		)

	// check if user owns this url
	if (url.ownerId !== currentUser.userId)
		return c.json(
			onFailureResponse("UNAUTHORIZED", "Not authorized to make this request."),
			HttpsCode.UNAUTHORIZED
		)

	// delete the url
	await db.delete(urlTable).where(eq(urlTable.id, url.id))

	return c.json(onSuccessResponse(null), 200)
}
