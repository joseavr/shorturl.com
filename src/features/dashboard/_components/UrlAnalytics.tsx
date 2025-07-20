import { FeatherArrowDown, FeatherArrowUp } from "@subframe/core"
import { Badge } from "@/ui"

export function UrlAnalytics() {
	return (
		<div className="flex w-full flex-wrap items-start gap-4">
			<div className="flex shrink-0 grow basis-0 flex-col items-start gap-4 rounded-md border border-neutral-border border-solid bg-default-background px-4 py-4 shadow-sm">
				<span className="line-clamp-1 w-full font-caption-bold text-caption-bold text-subtext-color">
					Total URLs
				</span>
				<div className="flex w-full flex-col items-start gap-2">
					<span className="font-heading-2 text-default-font text-heading-2">156</span>
					<Badge variant="success" icon={<FeatherArrowUp />}>
						24% this month
					</Badge>
				</div>
			</div>
			<div className="flex shrink-0 grow basis-0 flex-col items-start gap-4 rounded-md border border-neutral-border border-solid bg-default-background px-4 py-4 shadow-sm">
				<span className="line-clamp-1 w-full font-caption-bold text-caption-bold text-subtext-color">
					Total Clicks
				</span>
				<div className="flex w-full flex-col items-start gap-2">
					<span className="font-heading-2 text-default-font text-heading-2">2,847</span>
					<Badge variant="success" icon={<FeatherArrowUp />}>
						12% this week
					</Badge>
				</div>
			</div>
			<div className="flex shrink-0 grow basis-0 flex-col items-start gap-4 rounded-md border border-neutral-border border-solid bg-default-background px-4 py-4 shadow-sm">
				<span className="line-clamp-1 w-full font-caption-bold text-caption-bold text-subtext-color">
					Avg. Click Rate
				</span>
				<div className="flex w-full flex-col items-start gap-2">
					<span className="font-heading-2 text-default-font text-heading-2">18.2%</span>
					<Badge variant="error" icon={<FeatherArrowDown />}>
						3% this week
					</Badge>
				</div>
			</div>
		</div>
	)
}
