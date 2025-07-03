import { relations, sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { userTable } from "./users"

export const urlTable = sqliteTable("urls", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()), // UUID or hash
	originalUrl: text("original_url").notNull(),
	shortCode: text("short_code").unique().notNull(),
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
export const selectPublicUrlSchema = createSelectSchema(urlTable).omit({
	ownerId: true
})
export const selectUrlSchema = createSelectSchema(urlTable)
export const insertUrlSchema = createInsertSchema(urlTable)
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		ownerId: true
	})
	.required({
		originalUrl: true,
		shortCode: true
	})
export const updateUrlSchema = createUpdateSchema(urlTable).omit({
	createdAt: true,
	updatedAt: true,
	ownerId: true
})

export const selectUrlClickSchema = createSelectSchema(urlClickTable)
export const insertUrlClickSchema = createInsertSchema(urlClickTable)
