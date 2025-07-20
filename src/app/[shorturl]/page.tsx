import { notFound, redirect } from "next/navigation"
import { after } from "next/server"
import { getMetaData } from "./_services/get-metadata"
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

	// Get IP address and userAgent from headers
	const { ipAddress, userAgent } = await getMetaData()

	// Track the click
	after(() => {
		if (!urlData) return
		trackUrlClick(urlData.id, ipAddress, userAgent)
	})

	redirect(urlData.originalUrl)
}
