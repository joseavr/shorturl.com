"use client"

import { FeatherSearch } from "@subframe/core"
import { TextField, TextFieldInput } from "@/ui"

export default function Search() {
	return (
		<TextField variant="filled" label="" helpText="" icon={<FeatherSearch />}>
			<TextFieldInput
				placeholder="Search URLs..."
				value=""
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
			/>
		</TextField>
	)
}
