import packageJSON from "@@/package.json"
import { OpenAPIHono } from "@hono/zod-openapi"
import { Scalar } from "@scalar/hono-api-reference"
import { cors } from "hono/cors"
import { handle } from "hono/vercel"

export const runtime = "edge"

// Instead of using Hono() as:
// 		const app = new Hono().basePath("/api")
// We will use OpenAPIHono() to document our endpoints
const app = new OpenAPIHono()

app.use("/*", cors())

app.doc("/doc", {
	openapi: "3.0.0",
	info: {
		version: packageJSON.version,
		title: "Tasks API"
	}
})

app.get(
	"/reference",
	Scalar({
		url: "/doc",
		theme: "kepler",
		layout: "classic",
		defaultHttpClient: {
			targetKey: "js",
			clientKey: "fetch"
		}
	})
)

// routes
const routes = app.route()

export const OPTIONS = handle(app)
export const GET = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)

export type AppType = typeof routes
