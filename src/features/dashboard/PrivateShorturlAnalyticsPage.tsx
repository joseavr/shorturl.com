import {
	FeatherArrowDown,
	FeatherArrowUp,
	FeatherCalendar,
	FeatherChevronDown,
	FeatherCopy,
	FeatherDownload,
	FeatherExternalLink,
	FeatherRefreshCw
} from "@subframe/core"
import Link from "next/link"
import { redirect } from "next/navigation"
import { appUrl } from "@/const"
import {
	AreaChart,
	Badge,
	Breadcrumbs,
	BreadcrumbsDivider,
	BreadcrumbsItem,
	Button,
	DefaultPageLayout,
	IconButton,
	Progress,
	TextField,
	TextFieldInput
} from "@/ui"
import { getServerSessionCache } from "../auth/lib/session"
import { ClickTable } from "./_components/ClickTable"
import { ProfileDropdown } from "./_components/ProfileDropdown"
import { getUrlById } from "./services/get-url-by-id"

interface Props {
	shortUrlId: string
}

export default async function PrivateShorturlAnalyticsPage({ shortUrlId }: Props) {
	const { isAuthenticated, getUser } = await getServerSessionCache()

	// NOT_AUTHORIZED
	if (!isAuthenticated) return redirect("/")

	const user = getUser()
	const url = await getUrlById(shortUrlId)

	// NOT_AUTHORIZED
	if (url?.ownerId !== user.userId) return "/"

	// NOT_FOUND
	if (!url) return redirect("/dashboard")

	const originalUrlStore = new URL(url.originalUrl)
	const originalUrlHostname = originalUrlStore.host
	const originalUrlPathname = originalUrlStore.pathname

	const appUrlStore = new URL(appUrl)
	const appUrlHostname = appUrlStore.host

	return (
		<DefaultPageLayout>
			<div className="flex w-full flex-col items-start gap-8 bg-default-background px-8 py-16">
				<div className="flex w-full flex-col items-start gap-4">
					<div className="flex w-full flex-row items-center justify-between">
						<div>
							<Breadcrumbs>
								<BreadcrumbsItem>
									<Link href="/">Home</Link>
								</BreadcrumbsItem>
								<BreadcrumbsDivider />
								<BreadcrumbsItem>
									<Link href="/dashboard">Dashboard</Link>
								</BreadcrumbsItem>
								<BreadcrumbsDivider />
								<BreadcrumbsItem active>{shortUrlId}</BreadcrumbsItem>
							</Breadcrumbs>
						</div>

						<ProfileDropdown user={user} />
					</div>

					<div className="flex w-full shrink-0 grow basis-0 items-center justify-between">
						<div className="flex w-full flex-col items-start gap-2">
							<div className="flex w-full justify-between">
								<div className="flex gap-x-2">
									<span className="font-heading-1 text-default-font text-heading-1">
										{`${appUrlHostname}/${url.shortUrl}`}
									</span>
									<IconButton
										icon={<FeatherCopy />}
										// onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
									/>
								</div>

								<div className="flex gap-x-2">
									<Button
										variant="neutral-primary"
										icon={<FeatherExternalLink />}
										// onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
									>
										Open URL
									</Button>
									<Button
										variant="neutral-tertiary"
										icon={<FeatherDownload />}
										// onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
									>
										Export
									</Button>
								</div>
							</div>
							<span className="font-body text-body text-subtext-color">
								{`${originalUrlHostname}${originalUrlPathname === "/" ? "" : originalUrlPathname}`}
							</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<TextField variant="filled" label="" helpText="" icon={<FeatherCalendar />}>
						<TextFieldInput
							placeholder="Select date range..."
							// value=""
							// onChange={(_event: React.ChangeEvent<HTMLInputElement>) => {}}
						/>
					</TextField>
					<Button
						variant="neutral-tertiary"
						icon={<FeatherRefreshCw />}
						// onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
					>
						Refresh
					</Button>
				</div>

				<div className="flex w-full flex-wrap items-start gap-6">
					<div className="flex shrink-0 grow basis-0 flex-col items-start gap-4 rounded-md border border-neutral-border border-solid bg-default-background px-6 py-6 shadow-sm">
						<span className="font-caption-bold text-caption-bold text-subtext-color">
							Total Clicks
						</span>
						<div className="flex w-full flex-col items-start gap-2">
							<span className="font-heading-2 text-default-font text-heading-2">
								1,245
							</span>
							<Badge variant="success" icon={<FeatherArrowUp />}>
								12% this week
							</Badge>
						</div>
					</div>
					<div className="flex shrink-0 grow basis-0 flex-col items-start gap-4 rounded-md border border-neutral-border border-solid bg-default-background px-6 py-6 shadow-sm">
						<span className="font-caption-bold text-caption-bold text-subtext-color">
							Unique Visitors
						</span>
						<div className="flex w-full flex-col items-start gap-2">
							<span className="font-heading-2 text-default-font text-heading-2">892</span>
							<Badge variant="success" icon={<FeatherArrowUp />}>
								8% this week
							</Badge>
						</div>
					</div>
					<div className="flex shrink-0 grow basis-0 flex-col items-start gap-4 rounded-md border border-neutral-border border-solid bg-default-background px-6 py-6 shadow-sm">
						<span className="font-caption-bold text-caption-bold text-subtext-color">
							Avg. Time on Page
						</span>
						<div className="flex w-full flex-col items-start gap-2">
							<span className="font-heading-2 text-default-font text-heading-2">
								2m 15s
							</span>
							<Badge variant="error" icon={<FeatherArrowDown />}>
								5% this week
							</Badge>
						</div>
					</div>
				</div>
				<div className="flex w-full flex-col items-start gap-6 rounded-md border border-neutral-border border-solid bg-default-background px-6 py-6 shadow-sm">
					<div className="flex w-full items-center justify-between">
						<span className="font-body-bold text-body-bold text-default-font">
							Click Performance
						</span>
						<Button
							variant="neutral-tertiary"
							iconRight={<FeatherChevronDown />}
							// onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
						>
							Last 30 days
						</Button>
					</div>
					<AreaChart
						categories={["Biology", "Business", "Psychology"]}
						data={[
							{ Year: "2015", Psychology: 120, Business: 110, Biology: 100 },
							{ Year: "2016", Psychology: 130, Business: 95, Biology: 105 },
							{ Year: "2017", Psychology: 115, Business: 105, Biology: 110 },
							{ Year: "2018", Psychology: 125, Business: 120, Biology: 90 },
							{ Year: "2019", Psychology: 110, Business: 130, Biology: 85 },
							{ Year: "2020", Psychology: 135, Business: 100, Biology: 95 },
							{ Year: "2021", Psychology: 105, Business: 115, Biology: 120 },
							{ Year: "2022", Psychology: 140, Business: 125, Biology: 130 }
						]}
						index={"Year"}
					/>
				</div>
				<div className="flex w-full flex-wrap items-start gap-6">
					<div className="flex shrink-0 grow basis-0 flex-col items-start gap-6 rounded-md border border-neutral-border border-solid bg-default-background px-6 py-6 shadow-sm">
						<span className="font-body-bold text-body-bold text-default-font">
							Top Referrers
						</span>
						<div className="flex w-full flex-col items-start">
							<div className="flex w-full items-center gap-2 py-4">
								<span className="line-clamp-1 w-24 flex-none font-caption-bold text-caption-bold text-default-font">
									Google
								</span>
								<Progress value={100} />
								<span className="line-clamp-1 w-16 flex-none text-right font-caption text-caption text-default-font">
									456
								</span>
							</div>
							<div className="flex w-full items-center gap-2 py-4">
								<span className="line-clamp-1 w-24 flex-none font-caption-bold text-caption-bold text-default-font">
									Twitter
								</span>
								<Progress value={75} />
								<span className="line-clamp-1 w-16 flex-none text-right font-caption text-caption text-default-font">
									342
								</span>
							</div>
							<div className="flex w-full items-center gap-2 py-4">
								<span className="line-clamp-1 w-24 flex-none font-caption-bold text-caption-bold text-default-font">
									LinkedIn
								</span>
								<Progress value={50} />
								<span className="line-clamp-1 w-16 flex-none text-right font-caption text-caption text-default-font">
									228
								</span>
							</div>
						</div>
					</div>
					<div className="flex shrink-0 grow basis-0 flex-col items-start gap-6 rounded-md border border-neutral-border border-solid bg-default-background px-6 py-6 shadow-sm">
						<span className="font-body-bold text-body-bold text-default-font">
							Device Breakdown
						</span>
						<div className="flex w-full flex-col items-start">
							<div className="flex w-full items-center gap-2 py-4">
								<span className="line-clamp-1 w-24 flex-none font-caption-bold text-caption-bold text-default-font">
									Mobile
								</span>
								<Progress value={65} />
								<span className="line-clamp-1 w-16 flex-none text-right font-caption text-caption text-default-font">
									809
								</span>
							</div>
							<div className="flex w-full items-center gap-2 py-4">
								<span className="line-clamp-1 w-24 flex-none font-caption-bold text-caption-bold text-default-font">
									Desktop
								</span>
								<Progress />
								<span className="line-clamp-1 w-16 flex-none text-right font-caption text-caption text-default-font">
									374
								</span>
							</div>
							<div className="flex w-full items-center gap-2 py-4">
								<span className="line-clamp-1 w-24 flex-none font-caption-bold text-caption-bold text-default-font">
									Tablet
								</span>
								<Progress value={5} />
								<span className="line-clamp-1 w-16 flex-none text-right font-caption text-caption text-default-font">
									62
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="flex w-full flex-col items-start gap-6">
					<span className="font-heading-3 text-default-font text-heading-3">
						Click History
					</span>
					<div className="flex w-full flex-col items-start gap-2 rounded-md border border-neutral-border border-solid bg-default-background px-6 py-6 shadow-sm">
						<ClickTable />
					</div>
				</div>
			</div>
		</DefaultPageLayout>
	)
}
