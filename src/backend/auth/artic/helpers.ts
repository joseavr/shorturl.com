import { and, eq } from "drizzle-orm"
import { db } from "@/backend/database"
import { accountTable, userTable } from "@/backend/database/drizzle/schemas"
import type { AuthAccount, AuthUser, AuthUserWithId } from "./types"

export const findUserByEmail = async (email: string) => {
	return db.query.userTable.findFirst({
		where: eq(userTable.email, email)
	})
}

// TODO Fix types with zod
export const findOrCreateUserByProviderAccount = async (
	user: AuthUser,
	account: AuthAccount
): Promise<AuthUserWithId> => {
	const existingUser = await findUserByEmail(user.email)

	//
	// If found
	//  - user has new tokens from Google (access_token, id_token, expires_at)
	// 	- update user's account table with new tokens
	//	- return found user
	//
	if (existingUser) {
		await db
			.update(accountTable)
			.set({
				access_token: account.accessToken,
				expires_at: account.expiresAt,
				id_token: account.idToken,
				// Google might (idk) give new refreshToken at second time.
				// Drizzle ignores updating refreshToken if undefined.
				refresh_token: account.refreshToken
			})
			.where(
				and(
					// Many accountTable can share userId field,
					// so better check on uniques fields
					eq(accountTable.provider, account.provider),
					eq(accountTable.providerAccountId, account.providerAccountId)
				)
			)

		return {
			userId: existingUser.id,
			name: existingUser.name,
			image: existingUser.image,
			email: existingUser.email,
			provider: "google"
		}
	}

	//
	// Otherwise, insert new user in db
	// and insert its account table
	//
	const [newUser] = await db
		.insert(userTable)
		.values({
			name: user.name,
			email: user.email,
			image: user.image
		})
		.returning({ id: userTable.id })

	await db.insert(accountTable).values({
		userId: newUser.id,
		provider: account.provider,
		providerAccountId: account.providerAccountId,
		access_token: account.accessToken,
		refresh_token: account.refreshToken,
		expires_at: account.expiresAt,
		id_token: account.idToken,
		scope: account.scope,
		token_type: account.tokenType
	})

	return {
		...user,
		userId: newUser.id
	}
}
