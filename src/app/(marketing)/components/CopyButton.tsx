"use client"

import { FeatherCheckCheck, FeatherCopy } from "@subframe/core"
import { useState } from "react"
import { IconButton } from "@/ui"

export function CopyButton({
	shortUrl,
	icon = <FeatherCopy />,
	onCopyIcon = <FeatherCheckCheck />
}: {
	shortUrl: string
	icon?: React.ReactNode
	onCopyIcon?: React.ReactNode
}) {
	const { isCopied, handleCopy } = useClipboard(shortUrl)

	const IconNode = isCopied ? onCopyIcon : icon

	return (
		<IconButton
			icon={IconNode}
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
