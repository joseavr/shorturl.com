import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"

const app = new OpenAPIHono()
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



export default app
