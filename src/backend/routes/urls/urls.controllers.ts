import { eq } from "drizzle-orm"
import { db } from "@/backend/database"
import { urlTable } from "@/backend/database/drizzle/schemas"
import type { AppRouteHandler } from "@/backend/types"
import type { getRoute } from "./urls.docs"

export const get: AppRouteHandler<getRoute> = async (c) => {
	const urls = await db.query.urlTable.findMany({
		where: eq(urlTable.visibility, "public")
	})

	return c.json({ data: urls }, 200)
}
