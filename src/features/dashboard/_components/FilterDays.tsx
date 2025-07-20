"use client"

import { FeatherChevronDown } from "@subframe/core"
import { Button } from "@/ui"

export function FilterDays() {
	return (
		<Button
			variant="neutral-tertiary"
			iconRight={<FeatherChevronDown />}
			onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
		>
			Last 30 days
		</Button>
	)
}
