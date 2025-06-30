import { relations } from "drizzle-orm"
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { urlTable } from "./urls"

export const userTable = sqliteTable("users", {
	id: text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text().notNull(),
	email: text().unique().notNull(),
	image: text().notNull()
})

export const userTableRelations = relations(userTable, ({ many }) => ({
	urls: many(urlTable)
}))

export const accountTable = sqliteTable(
	"accounts",
	{
		provider: text().notNull(),
		providerAccountId: text().notNull(),
		refresh_token: text(),
		access_token: text(),
		expires_at: integer(), // in miliseconds
		token_type: text(),
		scope: text(),
		id_token: text(),
		userId: text()
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
export const updateUserSchema = createUpdateSchema(userTable)

export const selectAccountSchema = createSelectSchema(accountTable)
export const insertAccountSchema = createInsertSchema(accountTable)
export const updateAccountSchema = createUpdateSchema(accountTable)
