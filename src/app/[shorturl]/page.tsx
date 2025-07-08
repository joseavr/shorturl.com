import { notFound, redirect } from "next/navigation"
import { getOriginalUrl } from "./_services/get-origin-url"

export default async function RedirectPage({
	params
}: {
	params: Promise<{ shorturl: string }>
}) {
	// find the url by hashurl passed in the params
	const { shorturl } = await params
	const originalUrl = await getOriginalUrl(shorturl)

	if (!originalUrl) notFound()

	redirect(originalUrl)
}
