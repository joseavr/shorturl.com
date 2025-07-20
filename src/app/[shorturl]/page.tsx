import { notFound, redirect } from "next/navigation"
import { getOriginalUrl } from "./_services/get-origin-url"
import { trackUrlClick } from "./_services/track-url-click"

export default async function RedirectPage({
	params
}: {
	params: Promise<{ shorturl: string }>
}) {
	// find the url by hashurl passed in the params
	const { shorturl } = await params
	const urlData = await getOriginalUrl(shorturl)

	if (!urlData) notFound()

	// Track the click
	await trackUrlClick(urlData.id)

	redirect(urlData.originalUrl)
}
