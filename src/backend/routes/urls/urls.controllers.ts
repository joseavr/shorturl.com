import { and, eq } from "drizzle-orm"
import { getUserSession } from "@/backend/auth/artic/session"
import { db } from "@/backend/database"
import { urlTable } from "@/backend/database/drizzle/schemas"
import type { AppRouteHandler } from "@/backend/types"
import {
	onFailureResponse,
	onSuccessResponse
} from "@/backend/utils/http-response-factory"
import * as HttpsCode from "@/backend/utils/http-status-codes"
import type {
	deletePrivateRoute,
	getAllPrivateRoute,
	getAllPublicRoute,
	patchPrivateRoute,
	postPrivateRoute
} from "./urls.docs"

export const getAllPublic: AppRouteHandler<getAllPublicRoute> = async (c) => {
	const urls = await db.query.urlTable.findMany({
		where: eq(urlTable.visibility, "public")
	})

	return c.json(onSuccessResponse(urls), HttpsCode.OK)
}

export const getAllPrivate: AppRouteHandler<getAllPrivateRoute> = async (c) => {
	const session = await getUserSession(c.req.raw)

	if (!session || session?.user) {
		return c.json(
			onFailureResponse("UNAUTHORIZED", "Not authorized to make this request."),
			HttpsCode.UNAUTHORIZED
		)
	}

	const urls = await db.query.urlTable.findMany({
		where: and(
			eq(urlTable.visibility, "private"),
			eq(urlTable.ownerId, session?.user.userId)
		)
	})

	return c.json(onSuccessResponse(urls), 200)
}

export const postPrivate: AppRouteHandler<postPrivateRoute> = async (c) => {
	const session = await getUserSession(c.req.raw)

	// what if user in db no exist...

	if (!session || !session?.user) {
		return c.json(
			onFailureResponse("UNAUTHORIZED", "Not authorized to make this request."),
			HttpsCode.UNAUTHORIZED
		)
	}

	const url = c.req.valid("json")

	const [newUrl] = await db.insert(urlTable).values(url).returning()

	return c.json(onSuccessResponse(newUrl), 200)
}

export const patchPrivate: AppRouteHandler<patchPrivateRoute> = async (c) => {
	const session = await getUserSession(c.req.raw)

	if (!session || session?.user) {
		return c.json(
			onFailureResponse("UNAUTHORIZED", "Not authorized to make this request."),
			HttpsCode.UNAUTHORIZED
		)
	}

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
	if (url.ownerId !== session.user.userId)
		return c.json(
			onFailureResponse("UNAUTHORIZED", "Not authorized to make this request."),
			HttpsCode.UNAUTHORIZED
		)

	// edit the url
	const urlToUpdate = c.req.valid("json")
	const [urlUpdated] = await db
		.update(urlTable)
		.set(urlToUpdate)
		.where(eq(urlTable.id, url.id))
		.returning()

	return c.json(onSuccessResponse(urlUpdated), 200)
}

export const deletePrivate: AppRouteHandler<deletePrivateRoute> = async (c) => {
	const session = await getUserSession(c.req.raw)

	if (!session || session?.user) {
		return c.json(
			onFailureResponse("UNAUTHORIZED", "Not authorized to make this request."),
			HttpsCode.UNAUTHORIZED
		)
	}

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
	if (url.ownerId !== session.user.userId)
		return c.json(
			onFailureResponse("UNAUTHORIZED", "Not authorized to make this request."),
			HttpsCode.UNAUTHORIZED
		)

	// delete the url
	await db.delete(urlTable).where(eq(urlTable.id, url.id))

	return c.json(onSuccessResponse(null), 200)
}
