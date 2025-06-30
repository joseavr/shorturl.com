import { relations } from "drizzle-orm"
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { urlTable } from "./urls"

export const userTable = sqliteTable("users", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	email: text("email").unique().notNull(),
	image: text("image").notNull()
})

export const userTableRelations = relations(userTable, ({ many }) => ({
	urls: many(urlTable)
}))

export const accountTable = sqliteTable(
	"accounts",
	{
		provider: text("provider").notNull(),
		providerAccountId: text("provider_account_id").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"), // in miliseconds
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		userId: text("user_id")
			.notNull()
			.references(() => userTable.id, { onDelete: "cascade" })
	},
	(account) => [
		primaryKey({
			columns: [account.provider, account.providerAccountId]
		})
	]
)

/********************
 *
 * Zod Validation schemas
 *
 ********************/
export const selectUserSchema = createSelectSchema(userTable)
export const insertUserSchema = createInsertSchema(userTable).omit({
	id: true
})

export const selectAccountSchema = createSelectSchema(accountTable)
export const insertAccountSchema = createInsertSchema(accountTable)
