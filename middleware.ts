import { geolocation, ipAddress } from '@vercel/functions'
import { type NextRequest, NextResponse } from "next/server"
import {  geoHeaderName, ipHeaderName, referrerHeaderName } from '@/const'
import { getServerSession } from "@/features/auth/lib/session"
import { isProtectedRoute } from "@/utils/protected-routes"

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Check if the route is protected
	if (isProtectedRoute(pathname)) {
		// Get Session
		const { isAuthenticated  } = await getServerSession(request)

		if (!isAuthenticated) {
			return NextResponse.redirect(new URL("/", request.url))
		}

		// Token is valid, allow the request to proceed
		const response = NextResponse.next()
		const ip = ipAddress(request)
		const geo = geolocation(request)
		const referrer = request.headers.get('referer') || "unknown-middleware"
    if (ip) response.headers.set(ipHeaderName, ip)
		response.headers.set(geoHeaderName, JSON.stringify(geo))
		response.headers.set(referrerHeaderName, referrer)
    return response
	}

	// For non-protected routes, allow the request to proceed
	return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder files
		 */
		"/((?!_next/static|_next/image|favicon.ico|public/).*)"
	]
}
