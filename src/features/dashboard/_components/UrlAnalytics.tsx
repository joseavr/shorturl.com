import { FeatherArrowDown, FeatherArrowUp } from "@subframe/core"
import { clickThisMonth } from "@/features/dashboard/utils/click-this-month"
import { clickThisWeek } from "@/features/dashboard/utils/click-this-week"
import { getPrivateUrlsCache } from "@/features/urls/data-access/get-urls"
import { Badge } from "@/ui"
import { calculateAvgClickRateGrowth } from "../utils/click-rate-compare-to-last-week"

export async function UrlAnalytics() {
	const urls = await getPrivateUrlsCache()

	const totalUrls = urls.length

	const totalClicks = urls.reduce((sum, url) => sum + url.clicksCount, 0)

	// sum clicksCount for urls created in the last 7 days
	const clicksThisWeek = clickThisWeek(urls)

	// sum clicksCount for urls created in the last 30 days
	const clicksThisMonth = clickThisMonth(urls)

	// Average click rate: total clicks / total urls
	const avgClickRate = totalUrls > 0 ? totalClicks / totalUrls : 0

	// Calculate last week's average click rate
	const avgClickRateChange = calculateAvgClickRateGrowth(urls, avgClickRate)

	return (
		<div className="flex w-full flex-wrap items-start gap-4">
			<div className="flex shrink-0 grow basis-0 flex-col items-start gap-4 rounded-md border border-neutral-border border-solid bg-default-background px-4 py-4 shadow-sm">
				<span className="line-clamp-1 w-full font-caption-bold text-caption-bold text-subtext-color">
					Total URLs
				</span>
				<div className="flex w-full flex-col items-start gap-2">
					<span className="font-heading-2 text-default-font text-heading-2">
						{totalUrls}
					</span>
					<Badge variant="success" icon={<FeatherArrowUp />}>
						{((totalUrls > 0 ? clicksThisMonth / totalUrls : 0) * 100).toFixed(0)}% this
						month
					</Badge>
				</div>
			</div>
			<div className="flex shrink-0 grow basis-0 flex-col items-start gap-4 rounded-md border border-neutral-border border-solid bg-default-background px-4 py-4 shadow-sm">
				<span className="line-clamp-1 w-full font-caption-bold text-caption-bold text-subtext-color">
					Total Clicks
				</span>
				<div className="flex w-full flex-col items-start gap-2">
					<span className="font-heading-2 text-default-font text-heading-2">
						{totalClicks}
					</span>
					<Badge variant="success" icon={<FeatherArrowUp />}>
						{((totalClicks > 0 ? clicksThisWeek / totalClicks : 0) * 100).toFixed(0)}%
						this week
					</Badge>
				</div>
			</div>
			<div className="flex shrink-0 grow basis-0 flex-col items-start gap-4 rounded-md border border-neutral-border border-solid bg-default-background px-4 py-4 shadow-sm">
				<span className="line-clamp-1 w-full font-caption-bold text-caption-bold text-subtext-color">
					Avg. Click Rate (clicks per URL)
				</span>
				<div className="flex w-full flex-col items-start gap-2">
					<span className="font-heading-2 text-default-font text-heading-2">
						{avgClickRate}
					</span>
					<Badge
						variant={avgClickRateChange < 0 ? "error" : "success"}
						icon={avgClickRateChange < 0 ? <FeatherArrowDown /> : <FeatherArrowUp />}
					>
						{avgClickRateChange.toFixed(1)}% this week
					</Badge>
				</div>
			</div>
		</div>
	)
}
