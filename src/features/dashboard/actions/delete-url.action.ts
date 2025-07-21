"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/database"
import { urlTable } from "@/database/drizzle/schemas"
import { getServerSessionCache } from "@/features/auth/lib/session"

export async function deleteUrlAction(urlId: string, ownerId: string) {
	// Check authentication + authorization
	const { isAuthenticated, getUser } = await getServerSessionCache()
	if (!isAuthenticated) return
	if (getUser().userId !== ownerId) return

	// User has permission
	// get url by id and check if exist in db
	const url = await db.query.urlTable.findFirst({
		where: eq(urlTable.id, urlId)
	})

	if (!url) return
	// extra check if user owns this url
	if (url.ownerId !== getUser().userId) return

	// delete the url
	await db.delete(urlTable).where(eq(urlTable.id, url.id))

	revalidatePath("/dashboard")
}
