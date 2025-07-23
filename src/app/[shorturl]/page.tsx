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

	console.log("\n\nFROM REDIRECT PAGE:", geo)

	const loc = `${geo.city || "unknown"}, ${geo.country || "unknown"} ${geo.flag || ""}`

	console.log(Object.keys(geo))
	console.log(Object(loc))
	console.log(geo.city, geo.country, geo.flag)
	console.log(loc)

	// Track the click
	after(() => {
		if (!urlData) return
		trackUrlClick(urlData.id, ipAddress, userAgent, referrer, deviceType, browser, loc)
	})

	redirect(urlData.originalUrl)
}
