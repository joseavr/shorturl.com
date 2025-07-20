import z from "zod"
import { SelectPrivateUrlSchema } from "@/database/drizzle/schemas"
import { onSuccessResponseSchema } from "@/utils/http-response-factory"

const schema = onSuccessResponseSchema(z.array(SelectPrivateUrlSchema))
type UrlsResponse = z.infer<typeof schema>["data"] | []

export function calculateAvgClickRateGrowth(urls: UrlsResponse, avgClickRate: number) {
	const now = new Date()
	const lastWeekStart = new Date(now)
	lastWeekStart.setDate(now.getDate() - 14) // set date 2 weeks ago
	const lastWeekEnd = new Date(now)
	lastWeekEnd.setDate(now.getDate() - 7) // set date 1 week ago

	const urlsLastWeek = urls.filter((url) => {
		const created = new Date(url.createdAt)
		return created >= lastWeekStart && created < lastWeekEnd
	})
	const clicksLastWeek = urlsLastWeek.reduce((sum, url) => sum + url.clicksCount, 0)
	const avgClickRateLastWeek =
		urlsLastWeek.length > 0 ? clicksLastWeek / urlsLastWeek.length : 0

	const avgClickRateChange =
		avgClickRateLastWeek === 0
			? 0
			: ((avgClickRateLastWeek - avgClickRate) / avgClickRate) * 100

	return avgClickRateChange
}
