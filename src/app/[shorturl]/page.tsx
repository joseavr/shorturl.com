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

	const { ipAddress, userAgent, referrer, deviceType, browser, geo } = await getMetaData()

	const location = `${geo.city || "unknown"}, ${geo.country || "unknown"} ${geo.flag || ""}`

	// Track the click
	after(() => {
		if (!urlData) return
		trackUrlClick(
			urlData.id,
			ipAddress,
			userAgent,
			referrer,
			deviceType,
			browser,
			location
		)
	})

	redirect(urlData.originalUrl)
}
