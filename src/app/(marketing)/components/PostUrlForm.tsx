"use client"

import { FeatherLink } from "@subframe/core"
import { useActionState } from "react"
import { Button, TextField, TextFieldInput } from "@/ui"
import { createUrlAction } from "../_services/create-url"

const initialState = {
	success: true,
	message: ""
}

// TODO change this form with react-hook-form with zod
// so we can validate input in client, not in server
export function PostUrlForm() {
	const [state, formAction, isLoading] = useActionState(createUrlAction, initialState)

	return (
		<form
			action={formAction}
			className="flex w-full flex-col items-start justify-center gap-4"
		>
			<TextField
				className="h-auto w-full flex-none"
				variant="filled"
				error={!state.success}
				helpText={!state.success ? state.message : undefined}
				icon={<FeatherLink />}
			>
				<TextFieldInput placeholder="Enter your URL here" name="url" />
			</TextField>
			<Button
				className="h-10 w-full flex-none"
				size="large"
				type="submit"
				loading={isLoading}
			>
				Shorten URL
			</Button>
		</form>
	)
}
