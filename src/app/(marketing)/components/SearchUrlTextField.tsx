import { FeatherSearch } from "@subframe/core"
import { TextField, TextFieldInput } from "@/ui"

export function SearchUrlTextField() {
	return (
		<TextField
			className="h-auto shrink-0 grow basis-0"
			variant="filled"
			label=""
			helpText=""
			icon={<FeatherSearch />}
		>
			<TextFieldInput placeholder="Search URLs" />
		</TextField>
	)
}
