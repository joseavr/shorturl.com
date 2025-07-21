"use client"

import { FeatherEye, FeatherLink, FeatherPlus, FeatherX, toast } from "@subframe/core"
import { useId, useState } from "react"
import { isDev } from "@/const"
import { Button, Dialog, Select, TextField, TextFieldInput } from "@/ui"
import { usePendingAction } from "@/utils/usePendingAction"
import { revalidateAction } from "../actions/revalidate-path.action"

interface CreateUrlFormData {
	originalUrl: string
	visibility: "public" | "private"
}

// TODO use React Hook Form with Zod
export function CreateUrlButton() {
	const [isOpen, setIsOpen] = useState(false)
	const [formData, setFormData] = useState<CreateUrlFormData>({
		originalUrl: "",
		visibility: "private"
	})
	const inputId = useId()
	const [pending, handleRevalidate] = usePendingAction(revalidateAction)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			const response = await fetch("/api/urls", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(formData)
			})

			if (!response.ok) {
				const errorData = (await response.json()) as { message?: string }
				toast.error(`Failed to create URL: ${errorData}`)
			}

			await response.json()
			setFormData({ originalUrl: "", visibility: "private" })

			// Close modal after a short delay
			setTimeout(() => {
				setIsOpen(false)
				handleRevalidate("/dashboard")
			}, 1500)
		} catch (err) {
			toast.error(`An unexpected error occurred`)
			isDev && console.log(err instanceof Error ? err.message : "")
		}
	}

	const handleClose = () => {
		setIsOpen(false)
		setFormData({ originalUrl: "", visibility: "private" })
	}

	return (
		<>
			<Button
				className="pr-3.5 pl-3"
				icon={<FeatherPlus />}
				onClick={() => setIsOpen(true)}
			>
				Create URL
			</Button>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<Dialog.Content className="w-full max-w-md">
					<div className="flex w-full flex-col gap-6 p-6">
						{/* Header */}
						<div className="flex items-center justify-between">
							<h2 className="font-semibold text-default-font text-xl">Create New URL</h2>
							<Button
								variant="neutral-tertiary"
								size="small"
								icon={<FeatherX />}
								onClick={handleClose}
								className="h-8 w-8 p-0"
							/>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
							<TextField
								label="Original URL"
								placeholder="https://example.com"
								icon={<FeatherLink />}
								value={formData.originalUrl}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setFormData((prev) => ({ ...prev, originalUrl: e.target.value }))
								}
								required
								htmlFor={inputId}
								disabled={pending}
							>
								<TextFieldInput
									placeholder="Enter your URL here"
									name="url"
									id={inputId}
									disabled={pending}
								/>
							</TextField>

							<Select
								label="Visibility"
								placeholder="Select visibility"
								icon={<FeatherEye />}
								value={formData.visibility}
								onValueChange={(value) =>
									setFormData((prev) => ({
										...prev,
										visibility: value as "public" | "private"
									}))
								}
								required
								disabled={pending}
							>
								<Select.Item value="private">
									Private - Only you can see this URL
								</Select.Item>
								<Select.Item value="public">Public - Anyone can see this URL</Select.Item>
							</Select>

							{/* Form Actions */}
							<div className="flex gap-3 pt-2">
								<Button
									type="button"
									variant="neutral-secondary"
									onClick={handleClose}
									className="flex-1"
									disabled={pending}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									loading={pending}
									className="flex-1"
									disabled={!formData.originalUrl.trim()}
								>
									Create
								</Button>
							</div>
						</form>
					</div>
				</Dialog.Content>
			</Dialog>
		</>
	)
}
