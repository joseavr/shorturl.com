"use client"

import { Badge, Table } from "@/ui"

export function ClickTable() {
	return (
		<Table
			header={
				<Table.HeaderRow>
					<Table.HeaderCell>Timestamp</Table.HeaderCell>
					<Table.HeaderCell>Location</Table.HeaderCell>
					<Table.HeaderCell>Device</Table.HeaderCell>
					<Table.HeaderCell>Browser</Table.HeaderCell>
					<Table.HeaderCell>Referrer</Table.HeaderCell>
				</Table.HeaderRow>
			}
		>
			<Table.Row>
				<Table.Cell>
					<span className="whitespace-nowrap font-body text-body text-neutral-500">
						2024-03-15 14:23
					</span>
				</Table.Cell>
				<Table.Cell>
					<span className="whitespace-nowrap font-body text-body text-neutral-500">
						New York, US
					</span>
				</Table.Cell>
				<Table.Cell>
					<Badge variant="neutral">Mobile</Badge>
				</Table.Cell>
				<Table.Cell>
					<span className="whitespace-nowrap font-body text-body text-neutral-500">
						Chrome
					</span>
				</Table.Cell>
				<Table.Cell>
					<span className="whitespace-nowrap font-body text-body text-neutral-500">
						twitter.com
					</span>
				</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell>
					<span className="whitespace-nowrap font-body text-body text-neutral-500">
						2024-03-15 14:20
					</span>
				</Table.Cell>
				<Table.Cell>
					<span className="whitespace-nowrap font-body text-body text-neutral-500">
						London, UK
					</span>
				</Table.Cell>
				<Table.Cell>
					<Badge variant="neutral">Desktop</Badge>
				</Table.Cell>
				<Table.Cell>
					<span className="whitespace-nowrap font-body text-body text-neutral-500">
						Safari
					</span>
				</Table.Cell>
				<Table.Cell>
					<span className="whitespace-nowrap font-body text-body text-neutral-500">
						linkedin.com
					</span>
				</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell>
					<span className="whitespace-nowrap font-body text-body text-neutral-500">
						2024-03-15 14:18
					</span>
				</Table.Cell>
				<Table.Cell>
					<span className="whitespace-nowrap font-body text-body text-neutral-500">
						Berlin, DE
					</span>
				</Table.Cell>
				<Table.Cell>
					<Badge variant="neutral">Tablet</Badge>
				</Table.Cell>
				<Table.Cell>
					<span className="whitespace-nowrap font-body text-body text-neutral-500">
						Firefox
					</span>
				</Table.Cell>
				<Table.Cell>
					<span className="whitespace-nowrap font-body text-body text-neutral-500">
						google.com
					</span>
				</Table.Cell>
			</Table.Row>
		</Table>
	)
}
