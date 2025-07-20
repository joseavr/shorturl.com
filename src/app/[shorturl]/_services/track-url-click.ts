import { db } from "@/database"
import { urlClickTable } from "@/database/drizzle/schemas"

export async function trackUrlClick(urlId: string, ipAddress: string, userAgent: string) {
	// Insert click record
	await db.insert(urlClickTable).values({
		urlId,
		ipAddress,
		userAgent
	})
}
