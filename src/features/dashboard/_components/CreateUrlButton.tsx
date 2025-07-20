"use client"

import { FeatherEye, FeatherLink, FeatherPlus, FeatherX } from "@subframe/core"
import { useRouter } from "next/navigation"
import { useId, useState } from "react"
import { Alert, Button, Dialog, Select, TextField, TextFieldInput } from "@/ui"

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
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)
	const inputId = useId()
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)
		setSuccess(null)

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
				throw new Error(errorData.message || "Failed to create URL")
			}

			await response.json()
			setSuccess("URL created successfully!")
			setFormData({ originalUrl: "", visibility: "private" })

			// Close modal after a short delay
			setTimeout(() => {
				setIsOpen(false)
				setSuccess(null)
				setIsLoading(false)
			}, 1500)
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unexpected error occurred")
		} finally {
			router.refresh()
		}
	}

	const handleClose = () => {
		setIsOpen(false)
		setFormData({ originalUrl: "", visibility: "private" })
		setError(null)
		setSuccess(null)
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

						{/* Success Message */}
						{success && (
							<Alert variant="success" title="Success!" description={success} />
						)}

						{/* Error Message */}
						{error && <Alert variant="error" title="Error" description={error} />}

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
								error={error?.includes("url")}
								helpText={error?.includes("url") ? "Please enter a valid URL" : undefined}
								htmlFor={inputId}
								disabled={isLoading}
							>
								<TextFieldInput
									placeholder="Enter your URL here"
									name="url"
									id={inputId}
									disabled={isLoading}
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
								disabled={isLoading}
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
									disabled={isLoading}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									loading={isLoading}
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
