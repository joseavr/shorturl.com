"use client"

import SubframeCore, {
	FeatherBarChart2,
	FeatherEdit2,
	FeatherMoreHorizontal,
	FeatherTrash
} from "@subframe/core"
import z from "zod"
import { appUrl } from "@/const"
import { SelectPrivateUrlSchema } from "@/database/drizzle/schemas"
import { relativeDate } from "@/lib/relativeDate"
import { Badge, DropdownMenu, IconButton, Table } from "@/ui"
import { onSuccessResponseSchema } from "@/utils/http-response-factory"

const schema = onSuccessResponseSchema(z.array(SelectPrivateUrlSchema))
type UrlsResponse = z.infer<typeof schema>

interface Props {
	urls: UrlsResponse["data"]
}

export function UrlTable({ urls }: Props) {
	return (
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
												<DropdownMenu.DropdownItem icon={<FeatherBarChart2 />}>
													Analytics
												</DropdownMenu.DropdownItem>
												<DropdownMenu.DropdownItem icon={<FeatherEdit2 />}>
													Edit
												</DropdownMenu.DropdownItem>
												<DropdownMenu.DropdownDivider />
												<DropdownMenu.DropdownItem icon={<FeatherTrash />}>
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
	)
}
