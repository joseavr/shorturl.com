import { redirect } from "next/navigation"

export default async function Redirect({
	params
}: {
	params: Promise<{ shorturl: string }>
}) {
	// find the url by hashurl passed in the params
	const { shorturl } = await params

	// if found, then redirect,
	// otherwise redirect to error page
	redirect("https://www.google.com")
}
