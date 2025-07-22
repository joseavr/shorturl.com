export function getTopByCategory<
	T extends Record<string, any>,
	C extends keyof T & string
>(table: T[], byCategory: C): [Array<Record<C, string> & { count: number }>, number] {
	const categoryBreakdown: Array<Record<C, string> & { count: number }> = []
	const tableByCategory = Object.groupBy(table, (c) =>
		String(c[byCategory] ?? "undefined")
	)

	Object.entries(tableByCategory).forEach(([key, value]) => {
		categoryBreakdown.push({
			[byCategory]: key,
			count: value?.length || 0
		} as Record<C, string> & { count: number })
	})

	const topCategory = categoryBreakdown.sort((a, b) => b.count - a.count).slice(0, 3)
	const categoryMax = Math.max(...categoryBreakdown.map((d) => d.count), 1)
	return [topCategory, categoryMax]
}
