"use client"

import SubframeCore, {
	FeatherAlertTriangle,
	FeatherBarChart2,
	FeatherCheckCircle,
	FeatherEdit2,
	FeatherMoreHorizontal,
	FeatherTrash,
	toast
} from "@subframe/core"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useId, useState } from "react"
import z from "zod"
import { appUrl } from "@/const"
import { SelectPrivateUrlSchema } from "@/database/drizzle/schemas"
import { relativeDate } from "@/lib/relativeDate"
import {
	Alert,
	Badge,
	Button,
	Dialog,
	DropdownMenu,
	IconButton,
	Select,
	Table,
	TextField,
	TextFieldInput,
	Toast
} from "@/ui"
import { onSuccessResponseSchema } from "@/utils/http-response-factory"
import { usePendingAction } from "@/utils/usePendingAction"
import { deleteUrlAction } from "../actions/delete-url.action"
import { editUrlAction } from "../actions/edit-url.action"

// TODO delete onSuccess... and leave z.array...
const schema = onSuccessResponseSchema(z.array(SelectPrivateUrlSchema))
type UrlsResponse = z.infer<typeof schema>

interface Props {
	urls: UrlsResponse["data"]
}

// TODO use hookform with zod
export function UrlTable({ urls }: Props) {
	const pathname = usePathname()
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [pending, handleDeleteUrl] = usePendingAction(deleteUrlAction)
	const [urlSelected, setUrlSelected] = useState<UrlsResponse["data"][0] | null>(null)

	const handleDeleteSelect = (url: UrlsResponse["data"][0]) => {
		setDeleteDialogOpen(true)
		setUrlSelected(url)
	}

	const handleDeleteConfirm = async (urlId: string, ownerId: string) => {
		if (!urlId) return

		handleDeleteUrl(urlId, ownerId)

		toast.custom(() => (
			<Toast
				icon={<FeatherCheckCircle />}
				variant="success"
				title="Your URL was succesfully deleted"
			/>
		))
		setDeleteDialogOpen(false)
		setUrlSelected(null)
	}

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false)
	}

	//
	const [editDialogOpen, setEditDialogOpen] = useState(false)
	const [editPending, handleEditUrl] = usePendingAction(editUrlAction)
	const [urlEditSelected, setUrlEditSelected] = useState<UrlsResponse["data"][0] | null>(
		null
	)
	const [editOriginalUrl, setEditOriginalUrl] = useState("")
	const [editVisibility, setEditVisibility] = useState<"public" | "private">("private")

	const handleEditSelect = (url: UrlsResponse["data"][0]) => {
		setEditDialogOpen(true)
		setUrlEditSelected(url)
		setEditOriginalUrl(url.originalUrl)
		setEditVisibility(url.visibility as "public" | "private")
	}

	const handleEditConfirm = async () => {
		if (!urlEditSelected) return

		handleEditUrl({
			urlId: urlEditSelected.id,
			originalUrl: editOriginalUrl,
			visibility: editVisibility
		})

		toast.custom(() => (
			<Toast
				icon={<FeatherCheckCircle />}
				variant="success"
				title="Your URL has changed"
				description={`Your new URL "${editOriginalUrl}" on "${editVisibility}" mode is live.`}
			/>
		))
		setEditDialogOpen(false)
		setUrlEditSelected(null)
	}

	const handleEditCancel = () => {
		setEditDialogOpen(false)
		setUrlEditSelected(null)
	}

	const editOriginalUrlId = useId()

	return (
		<>
			<Table
				header={
					<Table.HeaderRow>
						<Table.HeaderCell>Original URL</Table.HeaderCell>
						<Table.HeaderCell>Short URL</Table.HeaderCell>
						<Table.HeaderCell>Clicks</Table.HeaderCell>
						<Table.HeaderCell>Created</Table.HeaderCell>
						<Table.HeaderCell>Status</Table.HeaderCell>
						<Table.HeaderCell />
					</Table.HeaderRow>
				}
			>
				{urls.map((url) => {
					return (
						<Table.Row key={url.id}>
							<Table.Cell>
								<span className="whitespace-nowrap font-body-bold text-body-bold text-neutral-700">
									{url.originalUrl}
								</span>
							</Table.Cell>
							<Table.Cell>
								<span className="whitespace-nowrap font-body text-body text-neutral-500">
									{`${appUrl}/${url.shortUrl}`}
								</span>
							</Table.Cell>
							<Table.Cell>
								<span className="whitespace-nowrap font-body text-body text-neutral-500">
									{url.clicksCount}
								</span>
							</Table.Cell>
							<Table.Cell>
								<span className="whitespace-nowrap font-body text-body text-neutral-500">
									{relativeDate(url.createdAt)}
								</span>
							</Table.Cell>
							<Table.Cell>
								<Badge
									className="capitalize"
									variant={url.visibility === "public" ? "success" : "warning"}
								>
									{url.visibility}
								</Badge>
							</Table.Cell>
							<Table.Cell>
								<div className="flex shrink-0 grow basis-0 items-center justify-end">
									<SubframeCore.DropdownMenu.Root>
										<SubframeCore.DropdownMenu.Trigger asChild={true}>
											<IconButton
												icon={<FeatherMoreHorizontal />}
												onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
											/>
										</SubframeCore.DropdownMenu.Trigger>
										<SubframeCore.DropdownMenu.Portal>
											<SubframeCore.DropdownMenu.Content
												side="bottom"
												align="end"
												sideOffset={4}
												asChild={true}
											>
												<DropdownMenu>
													<Link href={`${pathname}/${url.id}`} className="w-full">
														<DropdownMenu.DropdownItem icon={<FeatherBarChart2 />}>
															Analytics
														</DropdownMenu.DropdownItem>
													</Link>
													<DropdownMenu.DropdownItem
														icon={<FeatherEdit2 />}
														onClick={() => handleEditSelect(url)}
													>
														Edit
													</DropdownMenu.DropdownItem>
													<DropdownMenu.DropdownDivider />
													<DropdownMenu.DropdownItem
														icon={<FeatherTrash />}
														onClick={() => handleDeleteSelect(url)}
													>
														Delete
													</DropdownMenu.DropdownItem>
												</DropdownMenu>
											</SubframeCore.DropdownMenu.Content>
										</SubframeCore.DropdownMenu.Portal>
									</SubframeCore.DropdownMenu.Root>
								</div>
							</Table.Cell>
						</Table.Row>
					)
				})}
			</Table>

			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<Dialog.Content className="max-w-md">
					<Alert
						className="w-full"
						variant="error"
						icon={<FeatherAlertTriangle />}
						title="Delete URL"
						description={`Are you sure you want to delete "${urlSelected?.originalUrl}"? This action cannot be undone.`}
						actions={
							<div className="flex gap-2">
								<Button
									variant="neutral-secondary"
									onClick={handleDeleteCancel}
									disabled={pending}
								>
									Cancel
								</Button>
								<Button
									variant="destructive-primary"
									onClick={() =>
										handleDeleteConfirm(urlSelected!.id, urlSelected!.ownerId || "")
									}
									disabled={pending}
								>
									Delete
								</Button>
							</div>
						}
					/>
				</Dialog.Content>
			</Dialog>

			<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
				<Dialog.Content className="w-full max-w-md p-6">
					<form
						className="flex w-full flex-col gap-6"
						onSubmit={(e) => {
							e.preventDefault()
							handleEditConfirm()
						}}
					>
						<div className="flex w-full flex-col gap-2">
							<label
								htmlFor={editOriginalUrlId}
								className="font-body-bold text-body-bold text-neutral-700"
							>
								Original URL
							</label>
							<TextField
								className="w-full"
								required
								htmlFor={editOriginalUrlId}
								disabled={pending}
							>
								<TextFieldInput
									value={editOriginalUrl}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setEditOriginalUrl(e.target.value)
									}
									className="w-full"
									placeholder="Enter your URL here"
									name="url"
									id={editOriginalUrlId}
									disabled={pending}
								/>
							</TextField>
						</div>
						<div className="flex w-full flex-col gap-2">
							<span className="font-body-bold text-body-bold text-neutral-700">
								Visibility
							</span>
							<Select
								value={editVisibility}
								onValueChange={(v) => setEditVisibility(v as "public" | "private")}
								className="w-full"
							>
								<Select.Item value="public">Public</Select.Item>
								<Select.Item value="private">Private</Select.Item>
							</Select>
						</div>
						<div className="mt-4 flex justify-end gap-2">
							<Button
								variant="neutral-secondary"
								onClick={handleEditCancel}
								type="button"
								disabled={editPending}
							>
								Cancel
							</Button>
							<Button
								variant="brand-primary"
								type="submit"
								loading={editPending}
								disabled={editPending || !editOriginalUrl}
							>
								Save
							</Button>
						</div>
					</form>
				</Dialog.Content>
			</Dialog>
		</>
	)
}
