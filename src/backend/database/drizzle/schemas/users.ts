import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const userTable = sqliteTable("users", {
	id: text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text(),
	email: text().unique(),
	emailVerified: integer({ mode: "timestamp_ms" }),
	image: text()
})

export const accountTable = sqliteTable(
	"accounts",
	{
		provider: text().notNull(),
		providerAccountId: text().notNull(),
		refresh_token: text(),
		access_token: text(),
		expires_at: integer(),
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
