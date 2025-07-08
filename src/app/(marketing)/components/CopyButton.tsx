"use client"

import { FeatherCopy } from "@subframe/core"
import type React from "react"
import { IconButton } from "@/ui"

const HOST_NAME = "http://localhost:3000"

export function CopyButton({ shortUrl }: { shortUrl: string }) {
	return (
		<IconButton
			icon={<FeatherCopy />}
			onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
				event.preventDefault()
				if (shortUrl) {
					await navigator.clipboard.writeText(`${HOST_NAME}/${shortUrl}`)
				}
			}}
		/>
	)
}
