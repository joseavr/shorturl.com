"use client"

import SubframeCore, {
	FeatherAlertTriangle,
	FeatherBarChart2,
	FeatherEdit2,
	FeatherMoreHorizontal,
	FeatherTrash
} from "@subframe/core"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import z from "zod"
import { appUrl, isDev } from "@/const"
import { SelectPrivateUrlSchema } from "@/database/drizzle/schemas"
import { relativeDate } from "@/lib/relativeDate"
import { Alert, Badge, Button, Dialog, DropdownMenu, IconButton, Table } from "@/ui"
import { onSuccessResponseSchema } from "@/utils/http-response-factory"

const schema = onSuccessResponseSchema(z.array(SelectPrivateUrlSchema))
type UrlsResponse = z.infer<typeof schema>

interface Props {
	urls: UrlsResponse["data"]
}

export function UrlTable({ urls }: Props) {
	const pathname = usePathname()
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [urlToDelete, setUrlToDelete] = useState<UrlsResponse["data"][0] | null>(null)

	const handleDeleteClick = (url: UrlsResponse["data"][0]) => {
		setUrlToDelete(url)
		setDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = async (urlId: string) => {
		if (!urlToDelete) return

		const response = await fetch(`/api/urls/${urlId}`, { method: "DELETE" })

		// TODO add sooner
		isDev && console.log(response.status)

		setDeleteDialogOpen(false)
		setUrlToDelete(null)
	}

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false)
		setUrlToDelete(null)
	}

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
													<DropdownMenu.DropdownItem icon={<FeatherEdit2 />}>
														Edit
													</DropdownMenu.DropdownItem>
													<DropdownMenu.DropdownDivider />
													<DropdownMenu.DropdownItem
														icon={<FeatherTrash />}
														onClick={() => handleDeleteClick(url)}
													>
														Delete
														<Dialog
															open={deleteDialogOpen}
															onOpenChange={setDeleteDialogOpen}
														>
															<Dialog.Content className="max-w-md p-6">
																<Alert
																	variant="error"
																	icon={<FeatherAlertTriangle />}
																	title="Delete URL"
																	description={`Are you sure you want to delete "${urlToDelete?.shortUrl}"? This action cannot be undone.`}
																	actions={
																		<div className="flex gap-2">
																			<Button
																				variant="neutral-secondary"
																				onClick={handleDeleteCancel}
																			>
																				Cancel
																			</Button>
																			<Button
																				variant="destructive-primary"
																				onClick={() => handleDeleteConfirm(url.id)}
																			>
																				Delete
																			</Button>
																		</div>
																	}
																/>
															</Dialog.Content>
														</Dialog>
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
		</>
	)
}
