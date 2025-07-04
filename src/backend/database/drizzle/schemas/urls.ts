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
	createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
		.$onUpdate(() => sql`CURRENT_TIMESTAMP`)
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
	clickedAt: text("clicked_at").default(sql`CURRENT_TIMESTAMP`),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent")
})

/********************
 *
 * Zod Validation schemas
 *
 ********************/
export const SelectPublicUrlSchema = createSelectSchema(urlTable).omit({
	ownerId: true
})
export const SelectUrlSchema = createSelectSchema(urlTable)
export const InsertUrlSchema = createInsertSchema(urlTable)
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
