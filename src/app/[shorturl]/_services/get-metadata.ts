import { headers } from "next/headers"
import { X_GEO_HEADER, X_IP_HEADER, X_REFERRER_HEADER } from "@/const"

type GeoHeaderT = {
	city?: string
	country?: string
	flag?: string
	region?: string
	countryRegion?: string
	latitude?: string
	longitude?: string
	postalCode?: string
}
export async function getMetaData() {
	const headersList = await headers()

	// Get user agent from headers
	// note: we must store custom in headers because in next.js
	// 			 cannot acccess the request object in page.tsx's
	const userAgent = headersList.get("user-agent") || "undefined"
	const userBrowser = headersList.get("sec-ch-ua") || "undefined"
	const ipAddress = headersList.get(X_IP_HEADER) || "undefined"
	const geo: GeoHeaderT = JSON.parse(headersList.get(X_GEO_HEADER) || "{}")
	const referrer = headersList.get(X_REFERRER_HEADER) || "undefined"

	const { deviceType, browser } = parseDeviceAndBrowser(userAgent + userBrowser)

	return {
		ipAddress,
		userAgent,
		referrer,
		deviceType,
		browser,
		geo
	}
}

// Helper to parse device type and browser from userAgent
function parseDeviceAndBrowser(userAgent: string) {
	let deviceType = "desktop"
	if (/mobile|iphone|android/i.test(userAgent)) deviceType = "mobile"
	else if (/tablet|ipad|android/i.test(userAgent)) deviceType = "tablet"

	let browser = "unknown"
	if (/brave/i.test(userAgent)) browser = "brave"
	else if (/chrome|crios/i.test(userAgent)) browser = "chrome"
	else if (/firefox|fxios/i.test(userAgent)) browser = "firefox"
	else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent))
		browser = "safari"
	else if (/edg/i.test(userAgent)) browser = "edge"
	else if (/opr|opera/i.test(userAgent)) browser = "opera"
	else if (/msie|trident/i.test(userAgent)) browser = "ie"

	return { deviceType, browser }
}
