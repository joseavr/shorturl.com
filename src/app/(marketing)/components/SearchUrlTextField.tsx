"use client"

import { FeatherSearch } from "@subframe/core"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { TextField, TextFieldInput } from "@/ui"

export function SearchUrlTextField() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const inputRef = useRef<HTMLInputElement>(null)
	const [query, setQuery] = useState("")

	// Sync state with query param on mount
	useEffect(() => {
		const q = searchParams.get("q") || ""
		setQuery(q)
	}, [searchParams])

	// Update query param in real time as user types (without navigation)
	const updateQueryParam = useCallback(
		(newValue: string) => {
			const params = new URLSearchParams(Array.from(searchParams.entries()))
			if (newValue) {
				params.set("q", newValue)
			} else {
				params.delete("q")
			}
			const url = `?${params.toString()}`
			window.history.replaceState(null, "", url)
		},
		[searchParams]
	)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value)
		updateQueryParam(e.target.value)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			const url = `?${searchParams.toString()}`
			router.push(url)
		}
	}

	return (
		<TextField
			className="h-auto shrink-0 grow basis-0"
			variant="filled"
			label=""
			helpText=""
			icon={<FeatherSearch />}
		>
			<TextFieldInput
				ref={inputRef}
				placeholder="Search URLs"
				value={query} // sync state
				onChange={handleChange}
				onKeyDown={handleKeyDown}
			/>
		</TextField>
	)
}
