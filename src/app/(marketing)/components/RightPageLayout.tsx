import { showUrlTextFieldFlag } from "@/const"
import { ScrollArea } from "@/ui/components/ScrollArea"
import { getPublicUrls } from "../_services/get-public-urls"
import { getUrlClickCount } from "../_services/get-url-click-count"
import { SearchUrlTextField } from "./SearchUrlTextField"
import UrlCard from "./UrlCard"

export async function RightPageLayout({
	searchParams
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const { q = "" } = await searchParams
	const query = Array.isArray(q) ? q[0] : q

	const [urls, clickCount] = await Promise.all([getPublicUrls(), getUrlClickCount()])

	const filteredUrls = query
		? (urls ?? []).filter((url) => {
				return url.originalUrl.includes(query)
			})
		: urls

	return (
		<div className="flex h-screen shrink-0 grow basis-0 flex-col items-start self-stretch overflow-hidden border-neutral-border border-l border-solid">
			<div className="flex h-20 w-full flex-none items-center justify-between border-neutral-border border-b border-solid px-6 py-6 ">
				<div className="flex flex-col gap-1">
					<span className="shrink-0 grow basis-0 font-heading-3 text-default-font text-heading-3">
						Recently Shortened
					</span>
					<span className="text-muted-foreground text-sm">
						Total clicks: {clickCount.toLocaleString()}
					</span>
				</div>

				{showUrlTextFieldFlag && <SearchUrlTextField />}
			</div>

			<ScrollArea className="h-screen w-full overflow-scroll">
				{filteredUrls.map((url) => (
					<UrlCard key={url.id} {...url} />
				))}
			</ScrollArea>
		</div>
	)
}
