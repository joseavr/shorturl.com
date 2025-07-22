"use client"

import { FeatherDownload } from "@subframe/core"
import { Button } from "@/ui"

export function ExportButton() {
	return (
		<Button
			variant="neutral-tertiary"
			icon={<FeatherDownload />}
			// onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {}}
		>
			Export
		</Button>
	)
}
