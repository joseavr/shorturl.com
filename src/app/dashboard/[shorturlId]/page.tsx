import { redirect } from "next/navigation"
import PrivateShorturlAnalyticsPage from "@/features/dashboard/PrivateShorturlAnalyticsPage"
import { showShorturlAnalyticsPage } from "@/flags"
import { WorkInProgress } from "@/ui/WorkInProgress"

export default async function ShorturlAnalyticsPage({
	params
}: {
	params: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const { shorturlId } = await params

	if (!shorturlId) return redirect("/dashboard")
	if (Array.isArray(shorturlId)) return redirect("/dashboard")

	if (!showShorturlAnalyticsPage)
		return (
			<div className="h-screen">
				<WorkInProgress />
			</div>
		)

	return <PrivateShorturlAnalyticsPage shortUrlId={shorturlId} />
}
