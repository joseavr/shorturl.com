"use client"

import { FeatherCheckCheck, FeatherCopy } from "@subframe/core"
import { useState } from "react"
import { IconButton } from "@/ui"

export function CopyButton({ shortUrl }: { shortUrl: string }) {
	const { isCopied, handleCopy } = useClipboard(shortUrl)

	const Icon = isCopied ? FeatherCheckCheck : FeatherCopy

	return (
		<IconButton
			icon={<Icon />}
			variant={isCopied ? "brand-tertiary" : undefined}
			onClick={handleCopy}
		/>
	)
}

function useClipboard(text: string) {
	const [isCopied, setIsCopied] = useState(false)

	const handleCopy = async () => {
		setIsCopied(true)
		await navigator.clipboard.writeText(text)

		setTimeout(() => {
			setIsCopied(false)
		}, 2500)
	}

	return { isCopied, handleCopy }
}
