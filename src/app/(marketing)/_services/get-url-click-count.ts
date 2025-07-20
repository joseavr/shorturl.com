import { count } from "drizzle-orm"
import { db } from "@/database"
import { urlClickTable } from "@/database/drizzle/schemas"

export async function getUrlClickCount() {
	const result = await db.select({ count: count() }).from(urlClickTable)
	return result[0]?.count || 0
}
