/** biome-ignore-all lint/suspicious/noExplicitAny: It is fine to have any here. */
"use client"

import { getDay } from "date-fns"
import { AreaChart } from "@/ui"
import { getTopByCategory } from "../utils/get-top-category"
import { getClicksFromWeekRange, getLastWeekRange } from "../utils/week-range"

interface Props {
	clicks: {
		location: string | null
		clickedAt: Date
		id: number
		urlId: string
		ipAddress: string | null
		userAgent: string | null
		referrer: string | null
		deviceType: string | null
		browser: string | null
	}[]
}

// TODO generateChartData(), filterXAxis='years'|'months'|'thisweek' and bycategory from queryParams,
// --- AreaChart Data (Top 3 Locations, Clicks per Day for Last Week) ---
export function ShorturlChart({ clicks }: Props) {
	const [topLocations] = getTopByCategory(clicks, "location")

	const daysOfWeek = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday"
	]

	// --- Top Locations ---
	const topLocationsForChart = topLocations.map((each) => each.location)

	const chartData: any[] = daysOfWeek.map((day) => {
		const entry: Record<string, any> = { Day: day }
		for (const location of topLocationsForChart) {
			entry[location] = 0
		}
		return entry
	})

	const { start: weekStart, end: weekEnd } = getLastWeekRange()
	const clicksLastWeek = getClicksFromWeekRange(clicks, weekStart, weekEnd)

	for (const c of clicksLastWeek) {
		const location = c.location || "undefined"
		if (!topLocationsForChart.includes(location)) continue
		const dayIdx = getDay(new Date(c.clickedAt))
		const dayName = daysOfWeek[dayIdx === 0 ? 6 : dayIdx - 1] // shift so 1=Monday->0, 0=Sunday->6
		const entry = chartData.find((e) => e.Day === dayName)
		if (entry) entry[location] += 1
	}

	return <AreaChart categories={topLocationsForChart} data={chartData} index={"Day"} />
}
