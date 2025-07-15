import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Helper to create a rate limiter instance
export function createRateLimiter(
	requests: number,
	duration: `${number} ${"s" | "m" | "h" | "d"}`
) {
	// In development, disable rate limiting
	if (process.env.NODE_ENV === "development") {
		return {
			limit: async () => ({
				success: true,
				pending: Promise.resolve(),
				limit: requests,
				remaining: requests,
				reset: Date.now() + 1000
			})
		}
	}
	return new Ratelimit({
		redis: Redis.fromEnv(),
		limiter: Ratelimit.slidingWindow(requests, duration),
		analytics: true,
		prefix: `@shorturl/ratelimit/${requests}-per-${duration}`
	})
}
