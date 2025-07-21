import { db } from "@/database"

export async function getUrlById(shortUrlId: string) {
	return await db.query.urlTable.findFirst({
		where(fields, operators) {
			return operators.eq(fields.id, shortUrlId)
		}
	})
}
