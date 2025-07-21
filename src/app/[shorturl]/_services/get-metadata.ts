import { headers } from "next/headers"

export async function getMetaData() {
	const headersList = await headers()
	const forwarded = headersList.get("x-forwarded-for")
	const realIp = headersList.get("x-real-ip")
	const ipAddress =
		forwarded?.split(",")[0] === "::1"
			? "localhost"
			: forwarded?.split(",")[0] || realIp || "unknown"

	// Get user agent from headers
	const userAgent = headersList.get("user-agent") || "unknown"

	// Get referrer from headers
	const referrer = headersList.get("referer") || headersList.get("referrer") || "unknown"

	const { deviceType, browser } = parseDeviceAndBrowser(userAgent)

	return {
		ipAddress,
		userAgent,
		referrer,
		deviceType,
		browser
	}
}

// Helper to parse device type and browser from userAgent
function parseDeviceAndBrowser(userAgent: string) {
	let deviceType = "desktop"
	if (/mobile|iphone|android/i.test(userAgent)) deviceType = "mobile"
	else if (/tablet|ipad|android/i.test(userAgent)) deviceType = "tablet"

	let browser = "unknown"
	if (/chrome|crios/i.test(userAgent)) browser = "chrome"
	else if (/firefox|fxios/i.test(userAgent)) browser = "firefox"
	else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent))
		browser = "safari"
	else if (/edg/i.test(userAgent)) browser = "edge"
	else if (/opr|opera/i.test(userAgent)) browser = "opera"
	else if (/msie|trident/i.test(userAgent)) browser = "ie"

	return { deviceType, browser }
}
