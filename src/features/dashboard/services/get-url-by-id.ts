import "server-only"
import { redirect } from "next/navigation"
import { db } from "@/database"
import { getServerSessionCache } from "@/features/auth/lib/session"

export async function getUrlById(shortUrlId: string) {
	const { isAuthenticated, getUser } = await getServerSessionCache()
	if (!isAuthenticated) return redirect("/")

	const url = await db.query.urlTable.findFirst({
		where(fields, operators) {
			return operators.eq(fields.id, shortUrlId)
		},
		with: {
			urlClicks: true
		}
	})

	// NOT_FOUND
	if (!url) return null

	// UNAUTHORIZED
	if (url.ownerId !== getUser().userId) return null

	return url
}
