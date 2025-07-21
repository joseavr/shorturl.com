import Link from "next/link"
import { Badge } from "./components/Badge"
import { Button } from "./components/Button"
import { twClassNames } from "./utils"

export function WorkInProgress() {
	return (
		<div
			className={twClassNames(
				"fixed inset-0 z-50 flex items-center justify-center bg-neutral-50"
			)}
		>
			<div
				className={twClassNames(
					"flex min-w-[320px] max-w-[90vw] flex-col items-center gap-6 rounded-xl border border-neutral-200 bg-white px-8 py-10 shadow-lg"
				)}
			>
				<Badge variant="warning">Work in Progress</Badge>
				<div className="flex flex-col items-center gap-2">
					<span className="text-center font-heading-2 text-default-font text-heading-2">
						This page is under construction
					</span>
					<span className="text-center font-body text-body text-subtext-color">
						We're working hard to bring you this feature. In the meantime, you can
						navigate to other parts of the site:
					</span>
				</div>
				<div className="mt-2 flex w-full flex-col gap-3">
					<Button asChild variant="brand-secondary" size="large" className="w-full">
						<Link href="/">Go to Home</Link>
					</Button>
					<Button asChild variant="brand-secondary" size="large" className="w-full">
						<Link href="/dashboard">Go to Dashboard</Link>
					</Button>
					<Button asChild variant="neutral-secondary" size="large" className="w-full">
						<Link href="#">Docs (coming soon)</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
