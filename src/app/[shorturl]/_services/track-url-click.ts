import { headers } from "next/headers"
import { db } from "@/database"
import { urlClickTable } from "@/database/drizzle/schemas"

export async function trackUrlClick(urlId: string) {
	const headersList = await headers()

	// Get IP address from headers
	const forwarded = headersList.get("x-forwarded-for")
	const realIp = headersList.get("x-real-ip")
	const ipAddress =
		forwarded?.split(",")[0] === "::1"
			? "localhost"
			: forwarded?.split(",")[0] || realIp || "unknown"

	// Get user agent from headers
	const userAgent = headersList.get("user-agent") || "unknown"

	// Insert click record
	await db.insert(urlClickTable).values({
		urlId,
		ipAddress,
		userAgent
	})
}
