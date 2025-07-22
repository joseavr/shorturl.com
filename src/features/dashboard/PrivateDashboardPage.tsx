import Link from "next/link"
import { redirect } from "next/navigation"
import { CreateUrlButton } from "@/features/dashboard/_components/CreateUrlButton"
import { FilterDays } from "@/features/dashboard/_components/FilterDays"
import { RefreshButton } from "@/features/dashboard/_components/RefreshButton"
import Search from "@/features/dashboard/_components/Search"
import { UrlsAnalytic } from "@/features/dashboard/_components/UrlsAnalytics"
import { UrlsTable } from "@/features/dashboard/_components/UrlsTable"
import { Breadcrumbs, BreadcrumbsDivider, BreadcrumbsItem } from "@/ui"
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout"
import { getServerSessionCache } from "../auth/lib/session"
import { getPrivateUrlsCache } from "../urls/data-access/get-urls"
import { ProfileDropdown } from "./_components/ProfileDropdown"

export async function PrivateDashboardPage() {
	const { isAuthenticated, getUser } = await getServerSessionCache()

	if (!isAuthenticated) redirect("/")

	const urls = await getPrivateUrlsCache()

	const user = getUser()

	return (
		<DefaultPageLayout>
			<div className="flex h-full w-full flex-col items-start gap-8 bg-default-background px-20 py-12">
				<div className="flex w-full flex-col items-start gap-4">
					<div className="flex w-full flex-row items-center justify-between">
						<div>
							<Breadcrumbs>
								<BreadcrumbsItem>
									<Link href="/">Home</Link>
								</BreadcrumbsItem>
								<BreadcrumbsDivider />
								<BreadcrumbsItem active>Dashboard</BreadcrumbsItem>
							</Breadcrumbs>
						</div>
						<div className="ml-4">
							<ProfileDropdown user={user} />
						</div>
					</div>

					<div className="flex w-full flex-col items-start gap-2">
						<span className="font-heading-1 text-default-font text-heading-1">
							URL Dashboard
						</span>
						<span className="font-body text-body text-subtext-color">
							Manage and track your shortened URLs
						</span>
					</div>
				</div>

				<UrlsAnalytic />

				<div className="flex w-full flex-col items-start gap-6">
					<div className="flex w-full flex-wrap items-center gap-4">
						<div className="flex shrink-0 grow basis-0 items-center gap-1">
							<Search />

							<FilterDays />
						</div>

						<div className="flex items-center gap-2">
							<RefreshButton />

							<CreateUrlButton />
						</div>
					</div>
					<div className="flex w-full flex-col items-start gap-2 overflow-auto rounded-md border border-neutral-border border-solid bg-default-background shadow-sm">
						<UrlsTable urls={urls} />
					</div>
				</div>
			</div>
		</DefaultPageLayout>
	)
}
