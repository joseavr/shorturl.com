import "server-only"

import { eq } from "drizzle-orm"
import z from "zod"
import { db } from "@/database"
import { SelectPrivateUrlSchema, urlTable } from "@/database/drizzle/schemas"
import { getServerSessionCache } from "@/features/auth/lib/session"
import { onSuccessResponseSchema } from "@/utils/http-response-factory"

const schema = onSuccessResponseSchema(z.array(SelectPrivateUrlSchema))
type UrlsResponse = z.infer<typeof schema>["data"] | []

export async function getPrivateUrls(): Promise<UrlsResponse> {
	const { isAuthenticated, getUser } = await getServerSessionCache()

	if (!isAuthenticated) {
		return []
	}

	const currentUser = getUser()

	const urls = await db.query.urlTable.findMany({
		where: eq(urlTable.ownerId, currentUser.userId),
		with: {
			urlClicks: true
		}
	})

	const urlsWithClicksCount = urls.map(({ urlClicks, ...url }) => ({
		...url,
		clicksCount: urlClicks.length
	}))

	return urlsWithClicksCount
}
