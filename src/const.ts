export const isDev = process.env.NODE_ENV === "development"
export const appUrl = process.env.NEXT_PUBLIC_APP_URL as string
export const X_IP_HEADER = "x-ip"
export const X_GEO_HEADER = "x-geo"
export const X_REFERRER_HEADER = "x-referrer"

// MANAGE BY FEATURES
// export const CUSTOM_HEADERS = {
//   AUTH: {
//     USER_ID: 'x-user-id',
//     ROLE: 'x-role',
//   },
//   TRACE: {
//     REQUEST_ID: 'x-request-id',
//     CORRELATION_ID: 'x-correlation-id',
//   },
// };