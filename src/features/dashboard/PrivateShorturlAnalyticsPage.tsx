import {
	FeatherArrowDown,
	FeatherArrowUp,
	FeatherCalendar,
	FeatherExternalLink
} from "@subframe/core"
import { getDay } from "date-fns"
import Link from "next/link"
import { redirect } from "next/navigation"
import { CopyButton } from "@/app/(marketing)/components/CopyButton"
import { appUrl } from "@/const"
import {
	AreaChart,
	Badge,
	Breadcrumbs,
	BreadcrumbsDivider,
	BreadcrumbsItem,
	Button,
	DefaultPageLayout,
	Progress,
	TextField,
	TextFieldInput
} from "@/ui"
import { getServerSessionCache } from "../auth/lib/session"
import { ClickTable } from "./_components/ClickTable"
import { ExportButton } from "./_components/ExportButton"
import { FilterClickByDaysButton } from "./_components/FilterClickByDaysButton"
import { ProfileDropdown } from "./_components/ProfileDropdown"
import { RefreshButton } from "./_components/RefreshButton"
import { getUrlById } from "./services/get-url-by-id"
import { getTopByCategory } from "./utils/get-top-category"
import {
	getClicksFromWeekRange,
	getLastWeekRange,
	getPreviousWeekRange
} from "./utils/week-range"

interface Props {
	shortUrlId: string
}

export default async function PrivateShorturlAnalyticsPage({ shortUrlId }: Props) {
	const { isAuthenticated, getUser } = await getServerSessionCache()

	// NOT_AUTHORIZED
	if (!isAuthenticated) return redirect("/")

	const user = getUser()
	const url = await getUrlById(shortUrlId)
	if (!url) return redirect("/dashboard")

	const originalUrlStore = new URL(url.originalUrl)
	const originalUrlHostname = originalUrlStore.host
	const originalUrlPathname = originalUrlStore.pathname

	const appUrlStore = new URL(appUrl)
	const appUrlHostname = appUrlStore.host

	// --- Analytics Logic ---
	const { start: weekStart, end: weekEnd } = getLastWeekRange()
	const { start: prevWeekStart, end: prevWeekEnd } = getPreviousWeekRange()

	// Filter clicks for last week and previous week
	const clicks = url.urlClicks || []
	const clicksLastWeek = getClicksFromWeekRange(clicks, weekStart, weekEnd)
	const clicksPrevWeek = getClicksFromWeekRange(clicks, prevWeekStart, prevWeekEnd)

	// --- Total Clicks ---
	const totalClicks = clicks.length
	const totalClicksLastWeek = clicksLastWeek.length
	const totalClicksPrevWeek = clicksPrevWeek.length
	const totalClicksChange =
		totalClicksPrevWeek === 0
			? 0
			: ((totalClicksLastWeek - totalClicksPrevWeek) / totalClicksPrevWeek) * 100

	// --- Unique Visitors ---
	const uniqueVisitors = new Set(clicks.map((c) => c.ipAddress)).size
	const uniqueVisitorsLastWeek = new Set(clicksLastWeek.map((c) => c.ipAddress)).size
	const uniqueVisitorsPrevWeek = new Set(clicksPrevWeek.map((c) => c.ipAddress)).size
	const uniqueVisitorsChange =
		uniqueVisitorsPrevWeek === 0
			? 0
			: ((uniqueVisitorsLastWeek - uniqueVisitorsPrevWeek) / uniqueVisitorsPrevWeek) * 100

	// --- Top Browsers ---
	const [topBrowsers, browserMax] = getTopByCategory(clicks, "browser")

	// --- Top Devices ---
	const [topDevices, deviceMax] = getTopByCategory(clicks, "deviceType")

	// --- Top Locations ---
	const [topLocations] = getTopByCategory(clicks, "location")

	// TODO generateChartData(), filterXAxis='years'|'months'|'thisweek' and bycategory from queryParams,
	// --- AreaChart Data (Top 3 Locations, Clicks per Day for Last Week) ---
	const daysOfWeek = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday"
	]
	const topLocationsForChart = topLocations.map((each) => each.location)
	const chartData: any[] = daysOfWeek.map((day) => {
		const entry: Record<string, any> = { Day: day }
		for (const location of topLocationsForChart) {
			entry[location] = 0
		}
		return entry
	})
	for (const c of clicksLastWeek) {
		const location = c.location || "undefined"
		if (!topLocationsForChart.includes(location)) continue
		const dayIdx = getDay(new Date(c.clickedAt))
		const dayName = daysOfWeek[dayIdx === 0 ? 6 : dayIdx - 1] // shift so 1=Monday->0, 0=Sunday->6
		const entry = chartData.find((e) => e.Day === dayName)
		if (entry) entry[location] += 1
	}

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
								<BreadcrumbsItem
									active
								>{`...${shortUrlId.slice(Math.floor(shortUrlId.length / 1.5))}`}</BreadcrumbsItem>
							</Breadcrumbs>
						</div>

						<ProfileDropdown user={user} />
					</div>

					<div className="flex w-full shrink-0 grow basis-0 items-center justify-between">
						<div className="flex w-full flex-col items-start gap-2">
							<div className="flex w-full items-center justify-between">
								<div className="flex gap-x-2">
									<span className="font-heading-1 text-default-font text-heading-1">
										{`${appUrlHostname}/${url.shortUrl}`}
									</span>
									<CopyButton shortUrl={`${appUrlHostname}/${url.shortUrl}`} />
								</div>

								<div className="flex gap-x-2">
									<Button variant="neutral-primary" icon={<FeatherExternalLink />}>
										<Link href={url.originalUrl} target="_blank">
											Open URL
										</Link>
									</Button>

									<ExportButton />
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
					<RefreshButton />
				</div>

				<div className="flex w-full flex-wrap items-start gap-6">
					<div className="flex shrink-0 grow basis-0 flex-col items-start gap-4 rounded-md border border-neutral-border border-solid bg-default-background px-6 py-6 shadow-sm">
						<span className="font-caption-bold text-caption-bold text-subtext-color">
							Total Clicks
						</span>
						<div className="flex w-full flex-col items-start gap-2">
							<span className="font-heading-2 text-default-font text-heading-2">
								{totalClicks}
							</span>
							<Badge
								variant={totalClicksChange < 0 ? "error" : "success"}
								icon={totalClicksChange < 0 ? <FeatherArrowDown /> : <FeatherArrowUp />}
							>
								{Math.abs(totalClicksChange).toFixed(1)}% this week
							</Badge>
						</div>
					</div>
					<div className="flex shrink-0 grow basis-0 flex-col items-start gap-4 rounded-md border border-neutral-border border-solid bg-default-background px-6 py-6 shadow-sm">
						<span className="font-caption-bold text-caption-bold text-subtext-color">
							Unique Visitors
						</span>
						<div className="flex w-full flex-col items-start gap-2">
							<span className="font-heading-2 text-default-font text-heading-2">
								{uniqueVisitors}
							</span>
							<Badge
								variant={uniqueVisitorsChange < 0 ? "error" : "success"}
								icon={
									uniqueVisitorsChange < 0 ? <FeatherArrowDown /> : <FeatherArrowUp />
								}
							>
								{Math.abs(uniqueVisitorsChange).toFixed(1)}% this week
							</Badge>
						</div>
					</div>
				</div>
				<div className="flex w-full flex-col items-start gap-6 rounded-md border border-neutral-border border-solid bg-default-background px-6 py-6 shadow-sm">
					<div className="flex w-full items-center justify-between">
						<span className="font-body-bold text-body-bold text-default-font">
							Click Performance
						</span>
						<FilterClickByDaysButton />
					</div>
					<AreaChart categories={topLocationsForChart} data={chartData} index={"Day"} />
				</div>
				<div className="flex w-full flex-wrap items-start gap-6">
					<div className="flex shrink-0 grow basis-0 flex-col items-start gap-6 rounded-md border border-neutral-border border-solid bg-default-background px-6 py-6 shadow-sm">
						<span className="font-body-bold text-body-bold text-default-font">
							Top Browsers
						</span>
						<div className="flex w-full flex-col items-start">
							{topBrowsers.map((entry) => (
								<div key={entry.browser} className="flex w-full items-center gap-2 py-4">
									<span className="line-clamp-1 w-24 flex-none font-caption-bold text-caption-bold text-default-font">
										{entry.browser}
									</span>
									<Progress value={Math.round((entry.count / browserMax) * 100)} />
									<span className="line-clamp-1 w-16 flex-none text-right font-caption text-caption text-default-font">
										{entry.count}
									</span>
								</div>
							))}
						</div>
					</div>
					<div className="flex shrink-0 grow basis-0 flex-col items-start gap-6 rounded-md border border-neutral-border border-solid bg-default-background px-6 py-6 shadow-sm">
						<span className="font-body-bold text-body-bold text-default-font">
							Top Devices
						</span>
						<div className="flex w-full flex-col items-start">
							{topDevices.map(({ deviceType, count }) => (
								<div key={deviceType} className="flex w-full items-center gap-2 py-4">
									<span className="line-clamp-1 w-24 flex-none font-caption-bold text-caption-bold text-default-font">
										{deviceType}
									</span>
									<Progress value={Math.round((count / deviceMax) * 100)} />
									<span className="line-clamp-1 w-16 flex-none text-right font-caption text-caption text-default-font">
										{count}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="flex w-full flex-col items-start gap-6">
					<span className="font-heading-3 text-default-font text-heading-3">
						Click History
					</span>
					<div className="flex w-full flex-col items-start gap-2 rounded-md border border-neutral-border border-solid bg-default-background px-6 py-6 shadow-sm">
						<ClickTable
							clicks={url.urlClicks.map((click) => ({
								id: click.id,
								clickedAt: click.clickedAt,
								location: click.location,
								deviceType: click.deviceType,
								browser: click.browser,
								referrer: click.referrer
							}))}
						/>
					</div>
				</div>
			</div>
		</DefaultPageLayout>
	)
}
