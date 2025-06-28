/** biome-ignore-all lint/style/noNonNullAssertion: only for process.env until Implement .env with zod */
import * as arctic from "arctic"

const clientId = process.env.GOOGLE_CLIENT_ID!
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
const redirectUri = process.env.GOOGLE_REDIRECT_URI!

export const google = new arctic.Google(clientId, clientSecret, redirectUri)
