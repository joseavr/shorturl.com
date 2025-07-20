"use client"

import { useRouter } from "next/navigation"
import { useCallback, useTransition } from "react"
import { isDev } from "@/const"
import type { AuthUserWithId } from "@/features/auth/types"
import { Avatar, DropdownMenu } from "@/ui"
import { useClickOutside } from "../hooks/use-click-outside"

export function ProfileDropdown({ user }: { user: AuthUserWithId }) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [menuRef, buttonRef, open, setOpen] = useClickOutside()

	const handleLogout = useCallback(async () => {
		const response = await fetch("/api/auth/logout", { method: "POST" })
		isDev && console.log("\nlogout response status code\n", response.status)
		router.refresh()
	}, [router])

	return (
		<div className="relative">
			<button
				ref={buttonRef}
				type="button"
				className="focus:outline-none"
				onClick={() => setOpen((prev) => !prev)}
				aria-haspopup="true"
				aria-expanded={open}
			>
				<Avatar image={user?.image} size="medium" />
			</button>
			{open && (
				<div ref={menuRef} className="absolute right-0 z-50 mt-2">
					<DropdownMenu>
						<div className="min-w-[160px] p-2">
							<div className="mb-2 truncate pl-4 font-semibold">{user?.name}</div>
							<button
								type="button"
								className="w-full rounded px-4 py-2 text-left text-red-600 hover:bg-gray-100 disabled:opacity-50"
								onClick={() => startTransition(handleLogout)}
								disabled={isPending}
							>
								{isPending ? "Logging out..." : "Logout"}
							</button>
						</div>
					</DropdownMenu>
				</div>
			)}
		</div>
	)
}
