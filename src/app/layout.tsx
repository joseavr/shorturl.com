import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"

const inter = Inter({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-inter",
	display: "swap"
})

const outfit = Outfit({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-outfit",
	display: "swap"
})

export const metadata: Metadata = {
	title: "Shorturl",
	description: "Transform long URLs into memorable short links in seconds"
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${inter.variable} ${outfit.variable} antialiased`}>
				{children}
			</body>
		</html>
	)
}
