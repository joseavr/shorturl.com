import { DefaultPageLayout } from "@/ui"
import { LeftPageLayout, RightPageLayout } from "./components"

export default function MainPage({
	searchParams
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	return (
		<DefaultPageLayout>
			<div className="flex h-full w-full flex-col items-start bg-default-background">
				<div className="flex w-full shrink-0 grow basis-0 mobile:flex-col flex-wrap mobile:flex-wrap items-start mobile:gap-0">
					<LeftPageLayout />
					<RightPageLayout searchParams={searchParams} />
				</div>
			</div>
		</DefaultPageLayout>
	)
}
