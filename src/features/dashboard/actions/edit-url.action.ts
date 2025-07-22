"use server"

import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"
import { db } from "@/database"
import { urlTable } from "@/database/drizzle/schemas"
import { getServerSessionCache } from "@/features/auth/lib/session"

export async function editUrlAction({
	urlId,
	originalUrl,
	visibility
}: {
	urlId: string
	originalUrl: string
	visibility: "public" | "private"
}) {
	// Check authentication + authorization
	const { isAuthenticated, getUser } = await getServerSessionCache()
	if (!isAuthenticated) return

	// User has permission
	// get url by id and check if exist in db
	const url = await db.query.urlTable.findFirst({
		where: eq(urlTable.id, urlId)
	})

	if (!url) return
	// extra check if user owns this url
	if (url.ownerId !== getUser().userId) return

	// update the url
	// if url is same, only update visiblity
	if (url.originalUrl === originalUrl) {
		await db
			.update(urlTable)
			.set({
				visibility: url.visibility === visibility ? undefined : visibility,
				updatedAt: new Date()
			})
			.where(eq(urlTable.id, url.id))
	} else {
		// otherwise update url + shortUrl
		const newShortUrl = nanoid(8)

		await db
			.update(urlTable)
			.set({
				originalUrl: originalUrl,
				shortUrl: newShortUrl,
				visibility: visibility,
				updatedAt: new Date()
			})
			.where(eq(urlTable.id, url.id))
	}

	revalidatePath("/dashboard")
}
