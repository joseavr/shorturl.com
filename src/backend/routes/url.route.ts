import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"

export const urlRoute = new OpenAPIHono()
	.openapi(
		createRoute({
			method: "get",
			path: "/api/url",
			tags: ["Url"],
			responses: {
				200: {
					description: "Get URL Success",
					content: {
						"application/json": {
							schema: z
								.object({
									message: z.string()
								})
								.openapi("URLResponse")
						}
					}
				}
			}
		}),
		(c) => {
			return c.json({ message: "Hello" }, 200)
		}
	)

	.openapi(
		createRoute({
			method: "get",
			path: "/api/123",
			tags: ["Url"],
			responses: {
				200: {
					description: "Testing",
					content: {
						"application/json": {
							schema: z
								.object({
									message: z.string()
								})
								.openapi("URLResponse")
						}
					}
				}
			}
		}),
		(c) => {
			return c.json({ message: "getting shorturl" }, 200)
		}
	)
