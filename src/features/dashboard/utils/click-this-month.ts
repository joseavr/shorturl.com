import { differenceInDays } from "date-fns"
import z from "zod"
import { SelectPrivateUrlSchema } from "@/database/drizzle/schemas"
import { onSuccessResponseSchema } from "@/utils/http-response-factory"

const schema = onSuccessResponseSchema(z.array(SelectPrivateUrlSchema))
type UrlsResponse = z.infer<typeof schema>["data"] | []

export function clickThisMonth(urls: UrlsResponse) {
	const now = new Date()

	return urls.reduce((sum, url) => {
		if (differenceInDays(now, url.createdAt) <= 30) {
			return sum + url.clicksCount
		}
		return sum
	}, 0)
}
