"use server"

import { revalidatePath } from "next/cache"
import { InsertPublicUrlSchema } from "@/backend/database/drizzle/schemas"

export async function createUrlAction(_prevState: any, formData: FormData) {
	const validatedFields = InsertPublicUrlSchema.safeParse({
		originalUrl: formData.get("url")
	})

	// Return early if the form data is invalid
	if (!validatedFields.success) {
		console.log(validatedFields.error.flatten().fieldErrors.originalUrl)
		return {
			success: false,
			message: validatedFields.error.flatten().fieldErrors.originalUrl?.at(0)
		}
	}

	// Mutate data
	await fetch("http://localhost:3000/api/urls/public", {
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
