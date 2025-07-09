import { ScrollArea } from "@/ui/components/ScrollArea"
import { getPlublicUrls } from "../_services/get-public-urls"
import { SearchUrlTextField } from "./SearchUrlTextField"
import UrlCard from "./UrlCard"

export async function RightPageLayout() {
	const urls = await getPlublicUrls()

	return (
		<div className="flex h-screen shrink-0 grow basis-0 flex-col items-start self-stretch overflow-hidden border-neutral-border border-l border-solid">
			<div className="flex h-20 w-full flex-none items-center border-neutral-border border-b border-solid px-6 py-6 ">
				<span className="shrink-0 grow basis-0 font-heading-3 text-default-font text-heading-3">
					Recently Shortened
				</span>

				<SearchUrlTextField />
			</div>

			<ScrollArea className="h-screen w-full overflow-scroll">
				{urls.map((url) => (
					<UrlCard key={url.id} {...url} />
				))}
			</ScrollArea>
		</div>
	)
}
