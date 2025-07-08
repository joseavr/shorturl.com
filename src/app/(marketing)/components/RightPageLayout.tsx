import { FeatherSearch } from "@subframe/core"
// import { client } from "@/backend/lib/rpc"
import { TextField, TextFieldInput } from "@/ui"
import { ScrollArea, ScrollBar } from "@/ui/components/ScrollArea"
import UrlCard from "./UrlCard"

const HOST_NAME = "http://localhost:3000"

export async function RightPageLayout() {
	const response = await fetch(`${HOST_NAME}/api/urls/public`)
	const json = await response.json()

	const urls = json.success ? json.data : ([] as Array<any>)

	return (
		<div className="flex h-screen shrink-0 grow basis-0 flex-col items-start self-stretch overflow-hidden border-neutral-border border-l border-solid">
			<div className="flex h-20 w-full flex-none items-center border-neutral-border border-b border-solid px-6 py-6 ">
				<span className="shrink-0 grow basis-0 font-heading-3 text-default-font text-heading-3">
					Recently Shortened
				</span>
				<TextField
					className="h-auto shrink-0 grow basis-0"
					variant="filled"
					label=""
					helpText=""
					icon={<FeatherSearch />}
				>
					<TextFieldInput
						placeholder="Search URLs"
						// onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
					/>
				</TextField>
			</div>
			<ScrollArea className="h-full w-full overflow-scroll">
				{urls.map((url) => {
					return <UrlCard key={url.id} {...url} />
				})}

				<ScrollBar orientation="vertical" />
			</ScrollArea>
		</div>
	)
}
