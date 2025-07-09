import z from "zod"
import { SelectPublicUrlSchema } from "@/backend/database/drizzle/schemas"
import { onSuccessResponseSchema } from "@/backend/utils/http-response-factory"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL
const result = onSuccessResponseSchema(z.array(SelectPublicUrlSchema))
type UrlsResponse = z.infer<typeof result>

export async function getPlublicUrls() {
	const response = await fetch(`${APP_URL}/api/urls/public`)
	const json: UrlsResponse = await response.json()
	const urls = json.success ? json.data : []

	return urls
}
