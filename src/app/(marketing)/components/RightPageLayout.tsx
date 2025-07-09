import { showUrlTextFieldFlag } from "@/feature-flag"
import { ScrollArea } from "@/ui/components/ScrollArea"
import { getPlublicUrls } from "../_services/get-public-urls"
import { SearchUrlTextField } from "./SearchUrlTextField"
import UrlCard from "./UrlCard"

export async function RightPageLayout({
	searchParams
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const { q = "" } = await searchParams
	const query = Array.isArray(q) ? q[0] : q

	const urls = await getPlublicUrls()

	const filteredUrls = query
		? (urls ?? []).filter((url) => {
				return url.originalUrl.includes(query)
			})
		: urls

	return (
		<div className="flex h-screen shrink-0 grow basis-0 flex-col items-start self-stretch overflow-hidden border-neutral-border border-l border-solid">
			<div className="flex h-20 w-full flex-none items-center border-neutral-border border-b border-solid px-6 py-6 ">
				<span className="shrink-0 grow basis-0 font-heading-3 text-default-font text-heading-3">
					Recently Shortened
				</span>

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
