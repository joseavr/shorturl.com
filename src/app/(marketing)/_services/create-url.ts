"use server"

import { revalidatePath } from "next/cache"
import { appUrl } from "@/const"
import { InsertPublicUrlSchema } from "@/database/drizzle/schemas"

interface ActionReturn {
	success: boolean
	message: string | undefined
}

export async function createUrlAction(_prevState: ActionReturn, formData: FormData) {
	const validatedFields = InsertPublicUrlSchema.safeParse({
		originalUrl: formData.get("url")
	})

	// Return early if the form data is invalid
	if (!validatedFields.success) {
		return {
			success: false,
			message: validatedFields.error.flatten().fieldErrors.originalUrl?.at(0)
		}
	}

	// Mutate data
	await fetch(`${appUrl}/api/urls/public`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			originalUrl: formData.get("url")
		})
	})

	revalidatePath("/")

	return {
		success: true,
		message: "ok"
	}
}
