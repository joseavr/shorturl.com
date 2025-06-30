import { sqliteTable, AnySQLiteColumn, foreignKey, integer, text, uniqueIndex, primaryKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const urlClicks = sqliteTable("url_clicks", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	urlId: text("url_id").notNull().references(() => urls.id),
	clickedAt: text("clicked_at").default("sql`(CURRENT_TIMESTAMP)`"),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
});

export const urls = sqliteTable("urls", {
	id: text().primaryKey().notNull(),
	originalUrl: text("original_url").notNull(),
	shortCode: text("short_code").notNull(),
	ownerId: text("owner_id").references(() => users.id),
	visibility: text().default("private").notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: text("updated_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
(table) => [
	uniqueIndex("urls_short_code_unique").on(table.shortCode),
]);

export const users = sqliteTable("users", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	image: text().notNull(),
},
(table) => [
	uniqueIndex("users_email_unique").on(table.email),
]);

export const accounts = sqliteTable("accounts", {
	provider: text().notNull(),
	providerAccountId: text("provider_account_id").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
},
(table) => [
	primaryKey({ columns: [table.provider, table.providerAccountId], name: "accounts_provider_provider_account_id_pk"})
]);

