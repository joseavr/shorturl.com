"use client"

import { FeatherChevronDown } from "@subframe/core"
import { Button } from "@/ui"

export function FilterClickByDaysButton() {
	return (
		<Button
			variant="neutral-tertiary"
			iconRight={<FeatherChevronDown />}
			// onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
		>
			This week
		</Button>
	)
}
