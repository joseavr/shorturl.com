import { differenceInDays } from "date-fns"
import z from "zod"
import { SelectPrivateUrlSchema } from "@/database/drizzle/schemas"
import { onSuccessResponseSchema } from "@/utils/http-response-factory"

const schema = onSuccessResponseSchema(z.array(SelectPrivateUrlSchema))
type UrlsResponse = z.infer<typeof schema>["data"] | []

export function clickThisWeek(urls: UrlsResponse) {
	const now = Date.now()

	return urls.reduce((sum, url) => {
		if (differenceInDays(now, url.createdAt) <= 7) {
			return sum + url.clicksCount
		}
		return sum
	}, 0)
}
