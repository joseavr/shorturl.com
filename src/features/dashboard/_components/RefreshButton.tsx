"use client"

import { FeatherRefreshCw } from "@subframe/core"
import { cn } from "@/lib/utils"
import { Button } from "@/ui"
import { usePendingAction } from "@/utils/usePendingAction"
import { revalidateAction } from "../actions/revalidate-action"

export function RefreshButton() {
	const [pending, handleRevalidate] = usePendingAction(revalidateAction)
	return (
		<Button
			disabled={pending}
			variant="neutral-tertiary"
			icon={<FeatherRefreshCw className={cn(pending ? "animate-spin" : "")} />}
			onClick={() => handleRevalidate("/dashboard")}
		>
			Refresh
		</Button>
	)
}
