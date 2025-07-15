import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi"
import type { Schema } from "hono"

// biome-ignore lint/suspicious/noEmptyInterface: <testing>
export interface AppBindings {}

// biome-ignore lint/complexity/noBannedTypes: <allow this>
export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>

// types for route handlers
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>
