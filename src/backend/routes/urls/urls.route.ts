import { OpenAPIHono, z } from "@hono/zod-openapi"
import type { AppBindings } from "@/backend/types"
import * as controllers from "./urls.controllers"
import * as routesDocumented from "./urls.docs"

export const urlsRoute = new OpenAPIHono<AppBindings>()
	//
	.openapi(routesDocumented.get, controllers.get)
