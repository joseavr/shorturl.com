/** biome-ignore-all lint/suspicious/noExplicitAny: It is fine for typing */
import { endOfWeek, isWithinInterval, startOfWeek, subWeeks } from "date-fns"

export function getLastWeekRange() {
	const now = new Date()
	const start = startOfWeek(now, { weekStartsOn: 1 }) // Monday
	const end = endOfWeek(now, { weekStartsOn: 1 }) // Sunday
	return { start, end }
}

export function getPreviousWeekRange() {
	const now = new Date()
	const start = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
	const end = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
	return { start, end }
}

export function getClicksFromWeekRange<T extends Record<string, any>>(
	clicks: T[],
	weekStart: Date,
	weekEnd: Date
) {
	return clicks.filter(
		(c) =>
			c.clickedAt &&
			isWithinInterval(new Date(c.clickedAt), { start: weekStart, end: weekEnd })
	)
}
