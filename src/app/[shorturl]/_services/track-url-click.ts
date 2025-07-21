import { db } from "@/database"
import { urlClickTable } from "@/database/drizzle/schemas"

export async function trackUrlClick(
	urlId: string,
	ipAddress: string,
	userAgent: string,
	referrer: string,
	deviceType: string,
	browser: string
) {
	// Insert click record
	await db.insert(urlClickTable).values({
		urlId,
		ipAddress,
		userAgent,
		referrer,
		deviceType,
		browser
	})
}
