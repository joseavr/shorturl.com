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

	return {
		ipAddress,
		userAgent
	}
}
