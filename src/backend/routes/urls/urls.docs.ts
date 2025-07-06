import { createRoute, z } from "@hono/zod-openapi"
import {
	InsertPublicUrlSchema,
	InsertUrlSchema,
	SelectPublicUrlSchema,
	SelectUrlSchema,
	UpdateUrlSchema,
	UrlIDParamSchema
} from "@/backend/database/drizzle/schemas"
import {
	onFailureResponseSchema,
	onSuccessResponseSchema
} from "@/backend/utils/http-response-factory"

const TAGS = ["Urls"]

export const getAllPublic = createRoute({
	method: "get",
	path: "/public",
	tags: TAGS,
	responses: {
		200: {
			description: "Get all public URLs",
			content: {
				"application/json": {
					schema: onSuccessResponseSchema(z.array(SelectPublicUrlSchema))
				}
			}
		}
	}
})

export const getAllPrivate = createRoute({
	method: "get",
	path: "/",
	tags: TAGS,
	responses: {
		200: {
			description: "Get user URLs",
			content: {
				"application/json": {
					schema: onSuccessResponseSchema(z.array(SelectUrlSchema))
				}
			}
		},

		401: {
			description: "Unauthorized to make this request",
			content: {
				"application/json": {
					schema: onFailureResponseSchema()
				}
			}
		}
	}
})

export const postPrivate = createRoute({
	method: "post",
	path: "/",
	tags: TAGS,
	request: {
		body: {
			description: "The URL to create",
			required: true,
			content: {
				"application/json": {
					schema: InsertUrlSchema
				}
			}
		}
	},
	responses: {
		200: {
			description: "The created URL",
			content: {
				"application/json": {
					schema: onSuccessResponseSchema(SelectUrlSchema)
				}
			}
		},
		401: {
			description: "Unauthorized to make this request",
			content: {
				"application/json": {
					schema: onFailureResponseSchema()
				}
			}
		}
	}
})

export const postPublic = createRoute({
	method: "post",
	path: "/public",
	tags: TAGS,
	request: {
		body: {
			description: "The public URL to create",
			required: true,
			content: {
				"application/json": {
					schema: InsertPublicUrlSchema
				}
			}
		}
	},
	responses: {
		200: {
			description: "The created URL",
			content: {
				"application/json": {
					schema: onSuccessResponseSchema(SelectPublicUrlSchema)
				}
			}
		},
		401: {
			description: "Unauthorized to make this request",
			content: {
				"application/json": {
					schema: onFailureResponseSchema()
				}
			}
		}
	}
})

export const patchPrivate = createRoute({
	method: "patch",
	path: "/:urlId",
	tags: TAGS,
	request: {
		body: {
			description: "The URL to update",
			required: true,
			content: {
				"application/json": {
					schema: UpdateUrlSchema
				}
			}
		},
		params: UrlIDParamSchema
	},
	responses: {
		200: {
			description: "The URL updated",
			content: {
				"application/json": {
					schema: onSuccessResponseSchema(SelectUrlSchema)
				}
			}
		},

		401: {
			description: "Unauthorized to make this request.",
			content: {
				"application/json": {
					schema: onFailureResponseSchema()
				}
			}
		},

		404: {
			description: "Could not find the URL in our servers.",
			content: {
				"application/json": {
					schema: onFailureResponseSchema()
				}
			}
		}
	}
})

export const deletePrivate = createRoute({
	method: "delete",
	path: "/:urlId",
	tags: TAGS,
	request: {
		params: UrlIDParamSchema
	},
	responses: {
		200: {
			description: "The URL deleted",
			content: {
				"application/json": {
					schema: onSuccessResponseSchema(z.null())
				}
			}
		},

		401: {
			description: "Unauthorized to make this request.",
			content: {
				"application/json": {
					schema: onFailureResponseSchema()
				}
			}
		},

		404: {
			description: "Could not find the URL in our servers.",
			content: {
				"application/json": {
					schema: onFailureResponseSchema()
				}
			}
		}
	}
})

export type getAllPublicRoute = typeof getAllPublic
export type getAllPrivateRoute = typeof getAllPrivate
export type postPrivateRoute = typeof postPrivate
export type postPublicRoute = typeof postPublic
export type patchPrivateRoute = typeof patchPrivate
export type deletePrivateRoute = typeof deletePrivate
