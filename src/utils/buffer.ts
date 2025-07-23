/**
 * Accepts a string and converts to a base64 string.
 * Emojis will be converted to characters
 */
export function encodeHeaders(str: string) {
	return Buffer.from(JSON.stringify(str)).toString("base64")
}

/**
 * Accepts a string and converts from base64 string to normal string utf-8.
 * Characters that represents an emoji, will be converted to emoji symbol
 */
export function decodeHeaders(str: string) {
	return Buffer.from(str, "base64").toString("utf-8")
}
