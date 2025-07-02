import { z } from "@hono/zod-openapi"
import type { ZodTypeAny } from "zod"
import type * as HttpCodes from "./http-status-codes"

export function onSuccessResponse<T>(data: T) {
	return {
		success: true,
		data: data
	}
}
export const onSuccessResponseSchema = <T extends ZodTypeAny>(data: T) =>
	z.object({
		success: z.boolean().openapi({
			example: true
		}),
		data: data
	})

export function onFailureResponse(code: keyof typeof HttpCodes, message: string) {
	return {
		success: false,
		error: { code, message }
	}
}
export const onFailureResponseSchema = () =>
	z.object({
		success: z.boolean().openapi({
			example: false
		}),
		error: z.object({ code: z.string(), message: z.string() })
	})
