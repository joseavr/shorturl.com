import { db } from "@/database"

export async function getOriginalUrl(shortUrl: string) {
	const url = await db.query.urlTable.findFirst({
		where: (fields, operators) => operators.eq(fields.shortUrl, shortUrl)
	})

	return url ? { originalUrl: url.originalUrl, id: url.id } : null
}
