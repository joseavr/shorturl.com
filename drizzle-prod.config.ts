import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: ".env" })

// Configuration file used ONLY by Drizzle Kit CLI,
// not used for database operations.
// Can have multiple drizzle.config.ts files.
// By default, the CLI will look for `drizzle.config.ts` file,
// otherwise specify the path with --config=...
// i.e: drizzle-kit generate --config=drizzle-dev.config.ts
export default defineConfig({
	dialect: "turso",
	schema: "./src/database/drizzle/schemas",
	out: "./src/database/drizzle/migrations",
	dbCredentials: {
		url: 
			process.env.TURSO_DATABASE_URL as string,
		authToken: 
			process.env.TURSO_AUTH_TOKEN
	},
	migrations: {
		// migration files name are created by timestamp instead of by index
		prefix: "timestamp"
	}
})
