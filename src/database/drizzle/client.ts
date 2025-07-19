import { createClient } from "@libsql/client/web" // client/web for edge environment
import { drizzle } from "drizzle-orm/libsql"
import * as schema from "@/database/drizzle/schemas"
import { isDev } from "@/feature-flag"

//
// This creates a client connection to the Turso database
// that works only with serverless functions (node.js runtime)
// use case: all route.ts, by default, runs in node.js runtime
//

const tursoClient = createClient({
	url: (isDev
		? process.env.TURSO_DATABASE_LOCAL
		: process.env.TURSO_DATABASE_URL) as string,
	authToken: process.env.TURSO_AUTH_TOKEN as string
})

export const db = drizzle({ client: tursoClient, schema })
