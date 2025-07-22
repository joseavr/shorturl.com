"use client"

import { format } from "date-fns"
import { Badge, Table } from "@/ui"

export interface Click {
	id?: string | number
	clickedAt?: Date
	location?: string | null
	deviceType?: string | null
	browser?: string | null
	referrer?: string | null
}

export function ClickTable({ clicks = [] }: { clicks: Click[] }) {
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
			{clicks.length === 0 ? (
				<Table.Row>
					<Table.Cell colSpan={5}>
						<span className="font-body text-body text-neutral-500">No clicks yet.</span>
					</Table.Cell>
				</Table.Row>
			) : (
				clicks.map((click, idx) => (
					<Table.Row key={click.id ?? idx}>
						<Table.Cell>
							<span className="whitespace-nowrap font-body text-body text-neutral-500">
								{click.clickedAt
									? format(new Date(click.clickedAt), "yyyy-MM-dd HH:mm")
									: "-"}
							</span>
						</Table.Cell>
						<Table.Cell>
							<span className="whitespace-nowrap font-body text-body text-neutral-500">
								{click.location?.startsWith("unknown")
									? "unknown"
									: click.location || "unknown"}
							</span>
						</Table.Cell>
						<Table.Cell>
							<Badge variant="neutral">{click.deviceType || "Unknown"}</Badge>
						</Table.Cell>
						<Table.Cell>
							<span className="whitespace-nowrap font-body text-body text-neutral-500">
								{click.browser || "Unknown"}
							</span>
						</Table.Cell>
						<Table.Cell>
							<span className="whitespace-nowrap font-body text-body text-neutral-500">
								{click.referrer || "Direct"}
							</span>
						</Table.Cell>
					</Table.Row>
				))
			)}
		</Table>
	)
}
