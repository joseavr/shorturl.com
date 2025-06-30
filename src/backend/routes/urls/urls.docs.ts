import { createRoute, z } from "@hono/zod-openapi"
import { selectUrlSchema } from "@/backend/database/drizzle/schemas"

const TAGS = ["Urls"]

export const get = createRoute({
	method: "get",
	path: "/",
	tags: TAGS,
	responses: {
		200: {
			description: "Get URL Success",
			content: {
				"application/json": {
					schema: z.object({
						data: z.array(selectUrlSchema)
					})
				}
			}
		}
	}
})

export type getRoute = typeof get
