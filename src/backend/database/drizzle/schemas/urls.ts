import { z } from "@hono/zod-openapi"
import { relations, sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { userTable } from "./users"

export const urlTable = sqliteTable("urls", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()), // UUID or hash
	originalUrl: text("original_url").notNull(),
	shortUrl: text("short_code").unique().notNull(),
	ownerId: text("owner_id").references(() => userTable.id),
	visibility: text("visibility", { enum: ["public", "private"] })
		.notNull()
		.default("private"),
	createdAt: integer("created_at", {
		mode: "timestamp_ms"
	})
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	updatedAt: integer("updated_at", {
		mode: "timestamp_ms"
	})
		.notNull()
		.default(sql`(unixepoch() * 1000)`)
		.$onUpdate(() => sql`(unixepoch() * 1000)`)
})

export const urlTableRelations = relations(urlTable, ({ one }) => ({
	owner: one(userTable, {
		fields: [urlTable.ownerId],
		references: [userTable.id]
	})
}))

export const urlClickTable = sqliteTable("url_clicks", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	urlId: text("url_id")
		.notNull()
		.references(() => urlTable.id),
	clickedAt: integer("clicked_at", {
		mode: "timestamp_ms"
	}).default(sql`(unixepoch() * 1000)`),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent")
})

/********************
 *
 * Zod Validation schemas
 *
 ********************/
export const SelectPublicUrlSchema = createSelectSchema(urlTable).omit({
	ownerId: true,
	visibility: true
})
export const SelectUrlSchema = createSelectSchema(urlTable)
export const InsertUrlSchema = createInsertSchema(urlTable, {
	originalUrl: z.string().url("Must be a valid URL")
})
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		ownerId: true,
		shortUrl: true
	})
	.required({
		originalUrl: true,
		visibility: true
	})
export const InsertPublicUrlSchema = createInsertSchema(urlTable)
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		ownerId: true,
		shortUrl: true,
		visibility: true
	})
	.required({
		originalUrl: true
	})

export const UpdateUrlSchema = createUpdateSchema(urlTable).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	ownerId: true,
	shortUrl: true
})

export const SelectUrlClickSchema = createSelectSchema(urlClickTable)
export const InsertUrlClickSchema = createInsertSchema(urlClickTable)

export const UrlIDParamSchema = z.object({
	urlId: z.string().openapi({
		param: {
			name: "urlId",
			in: "path",
			required: true
		},
		required: ["urlId"],
		example: "bf616909-74c2-..."
	})
})
