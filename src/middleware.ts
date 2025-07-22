import { geolocation } from "@vercel/functions"
import { type NextRequest, NextResponse } from "next/server"
import { X_GEO_HEADER, X_IP_HEADER, X_REFERRER_HEADER } from "@/const"
import { getServerSession } from "@/features/auth/lib/session"
import { isProtectedRoute } from "@/utils/protected-routes"

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Check if the route is protected
	if (isProtectedRoute(pathname)) {
		// Get Session
		const { isAuthenticated } = await getServerSession(request)

		if (!isAuthenticated) {
			return NextResponse.redirect(new URL("/", request.url))
		}

		// Token is valid, allow the request to proce`ed
		return NextResponse.next()
	}

	const isRedirectRoute =
		/^\/([a-zA-Z0-9_-]{2,8})$/.test(pathname) && !pathname.startsWith("/dashboard")

	if (isRedirectRoute) {
		const response = NextResponse.next()
		const ip = request.headers.get("x-forwarded-for")
		const geo = geolocation(request)
		const referrer = request.headers.get("referer") || "unknown"
		response.headers.set(X_IP_HEADER, ip === "::1" ? "localhost" : ip || "unknown")
		response.headers.set(X_GEO_HEADER, JSON.stringify(geo))
		response.headers.set(X_REFERRER_HEADER, referrer)
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
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
	]
}
