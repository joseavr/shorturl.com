/** biome-ignore-all lint/suspicious/noExplicitAny: It is fine for this custom hook */
import { useTransition } from "react"

export function usePendingAction<Fn extends (...args: any[]) => Promise<any>>(
	action: Fn
): [boolean, (...args: Parameters<Fn>) => void] {
	const [isPending, startTransition] = useTransition()

	function handleAction(...args: Parameters<Fn>) {
		startTransition(async () => {
			await action(...args)
		})
	}

	return [isPending, handleAction]
}
