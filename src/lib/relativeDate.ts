import tinyRelativeDate from "tiny-relative-date"

export function relativeDate(date: Date, now?: Date): string {
	return tinyRelativeDate(new Date(date), now)
}
