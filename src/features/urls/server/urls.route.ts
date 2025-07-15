import { OpenAPIHono } from "@hono/zod-openapi"
import type { AppBindings } from "@/lib/types"
import * as urlControllers from "./urls.controllers"
import * as urlOpenapiRoutes from "./urls.docs"

export const urlsRoute = new OpenAPIHono<AppBindings>()
	.openapi(urlOpenapiRoutes.getAllPublic, urlControllers.getAllPublic)
	.openapi(urlOpenapiRoutes.getAllPrivate, urlControllers.getAllPrivate)
	.openapi(urlOpenapiRoutes.postPrivate, urlControllers.postPrivate)
	.openapi(urlOpenapiRoutes.postPublic, urlControllers.postPublic)
	.openapi(urlOpenapiRoutes.patchPrivate, urlControllers.patchPrivate)
	.openapi(urlOpenapiRoutes.deletePrivate, urlControllers.deletePrivate)
