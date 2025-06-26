import packageJSON from "@@/package.json"
import { OpenAPIHono } from "@hono/zod-openapi"
import { Scalar } from "@scalar/hono-api-reference"
import { handle } from "hono/vercel"

import url from "@/routes/url/route"

export const runtime = "edge"

//
// Instead of using Hono() as:
// 		const app = new Hono().basePath("/api")
// We will use OpenAPIHono() to document our endpoints
//
const app = new OpenAPIHono()

//
// Set OpenAPI at url: /doc
//
app.doc("/api/doc", {
	openapi: "3.0.0",
	info: {
		version: packageJSON.version,
		title: "ShortUrl API"
	}
})

//
// Scalar is like swagger.js but more beautiful
// A dashboard displays all documented endpoints
// Note:
// 	In next.js, we can only use endpoints starts with /api/...
// 	Thus cannot use endpoint /reference
//
app.get(
	"/api/reference",
	Scalar({
		url: "/api/doc",
		theme: "kepler",
		layout: "classic",
		defaultHttpClient: {
			targetKey: "js",
			clientKey: "fetch"
		}
	})
)

//
// RESOURCES
// 1. /api/user
// 2. /api/url
// 3. /:shortURL-ID
//
const routes = app.route("/", url)

//
// Hono will handle all HTTP methods
// instead of Next.js
//
export const OPTIONS = handle(app)
export const GET = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)

export type AppType = typeof routes
