"use client"

import { FeatherRefreshCw } from "@subframe/core"
import { startTransition, useActionState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/ui"
import { revalidateAction } from "../actions/revalidate-action"

export function RefreshButton() {
	const [_state, action, pending] = useActionState(revalidateAction, undefined)
	return (
		<Button
			disabled={pending}
			variant="neutral-tertiary"
			icon={<FeatherRefreshCw className={cn(pending ? "animate-spin" : "")} />}
			onClick={() => startTransition(action)}
		>
			Refresh
		</Button>
	)
}
