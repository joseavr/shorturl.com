export const isDev = process.env.NODE_ENV === "development"
export const appUrl = process.env.NEXT_PUBLIC_APP_URL as string
export const ipHeaderName = "x-client-ip"
export const geoHeaderName = "x-client-city"
export const referrerHeaderName = "x-referrer"
