import { relations } from "drizzle-orm/relations";
import { urls, urlClicks, users, accounts } from "./schema";

export const urlClicksRelations = relations(urlClicks, ({one}) => ({
	url: one(urls, {
		fields: [urlClicks.urlId],
		references: [urls.id]
	}),
}));

export const urlsRelations = relations(urls, ({one, many}) => ({
	urlClicks: many(urlClicks),
	user: one(users, {
		fields: [urls.ownerId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	urls: many(urls),
	accounts: many(accounts),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));