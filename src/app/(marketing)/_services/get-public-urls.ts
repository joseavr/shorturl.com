import z from "zod"
import { SelectPublicUrlSchema } from "@/database/drizzle/schemas"
import { onSuccessResponseSchema } from "@/utils/http-response-factory"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL
const schema = onSuccessResponseSchema(z.array(SelectPublicUrlSchema))
type UrlsResponse = z.infer<typeof schema>

export async function getPublicUrls() {
	const response = await fetch(`${APP_URL}/api/urls/public`, {
		cache: "force-cache"
	})
	const json: UrlsResponse = await response.json()
	const urls = json.success ? json.data : []

	return urls
}
