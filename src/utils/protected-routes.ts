// Define protected routes that require authentication
const PROTECTED_ROUTES = ["/dashboard"]

/**
 * Check if a pathname matches any of the protected routes
 */
export function isProtectedRoute(pathname: string): boolean {
	// Check if the pathname starts with any protected route
	return PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
}
