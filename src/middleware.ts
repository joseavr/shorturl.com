import { type NextRequest, NextResponse } from "next/server"
import { isProtectedRoute } from "@/utils/protected-routes"
import { getServerSessionCache } from "./features/auth/lib/session"

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Check if the route is protected
	if (isProtectedRoute(pathname)) {
		// Get JWT token from cookies
		const { isAuthenticated } = await getServerSessionCache()

		if (!isAuthenticated) {
			return NextResponse.redirect(new URL("/", request.url))
		}

		// Token is valid, allow the request to proceed
		return NextResponse.next()
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
