import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { userTable } from "./users"

export const urlTable = sqliteTable("urls", {
	id: text("id").primaryKey(), // UUID or hash
	originalUrl: text("original_url").notNull(),
	shortCode: text("short_code").unique().notNull(),
	ownerId: text("owner_id").references(() => userTable.id), // Nullable
	visibility: text("visibility", { enum: ["public", "private"] })
		.notNull()
		.default("private"),
	createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const urlClickTable = sqliteTable("url_clicks", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	urlId: text("url_id")
		.notNull()
		.references(() => urlTable.id),
	clickedAt: text("clicked_at").default(sql`CURRENT_TIMESTAMP`),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent")
})
