import z from "zod"
import { appUrl } from "@/const"
import { SelectPublicUrlSchema } from "@/database/drizzle/schemas"
import { onSuccessResponseSchema } from "@/utils/http-response-factory"

const schema = onSuccessResponseSchema(z.array(SelectPublicUrlSchema))
type UrlsResponse = z.infer<typeof schema>

export async function getPublicUrls() {
	const response = await fetch(`${appUrl}/api/urls/public`, {
		cache: "force-cache"
	})
	const json: UrlsResponse = await response.json()
	const urls = json.success ? json.data : []

	return urls
}
