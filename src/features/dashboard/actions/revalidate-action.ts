/** biome-ignore-all lint/suspicious/noConfusingVoidType: It is fine here */
"use server"
import { revalidatePath } from "next/cache"

export async function revalidateAction(_state?: undefined | void, _formData?: FormData) {
	revalidatePath("/dashboard")
}
