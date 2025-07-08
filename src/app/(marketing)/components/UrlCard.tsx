import type { z } from "@hono/zod-openapi"
import { FeatherEye } from "@subframe/core"
import Link from "next/link"
import relativeDate from "tiny-relative-date"
import type { SelectPublicUrlSchema } from "@/backend/database/drizzle/schemas"
import { LinkButton } from "@/ui"
import { CopyButton } from "./CopyButton"

const APP_FULL_URL = process.env.NEXT_PUBLIC_APP_URL as string

type UrlCardProps = z.infer<typeof SelectPublicUrlSchema>

export default function UrlCard(props: UrlCardProps) {
	const lastUpdated = relativeDate(new Date(props.updatedAt))

	// get the domain only
	const hostname = new URL(APP_FULL_URL).host

	return (
		<div className="flex w-full items-start border-neutral-border border-b border-solid px-6 py-6">
			<div className="flex shrink-0 grow basis-0 flex-col items-start gap-4">
				<div className="flex w-full flex-col items-start gap-2">
					<div className="flex w-full items-center justify-between">
						<span className="font-body-bold text-body-bold text-default-font">
							{`${hostname}/${props.shortUrl}`}
						</span>
						<CopyButton shortUrl={`${hostname}/${props.shortUrl}`} />
					</div>
					<LinkButton variant="neutral">
						<Link href={props.originalUrl} target="_blank">
							{props.originalUrl}
						</Link>
					</LinkButton>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-1">
						<FeatherEye className="font-body text-body text-subtext-color" />
						<span className="font-body text-body text-subtext-color">89 views</span>
					</div>
					<span className="font-body text-body text-subtext-color">•</span>
					<span className="font-body text-body text-subtext-color">{lastUpdated}</span>
				</div>
			</div>
		</div>
	)
}
