import type { z } from "@hono/zod-openapi"
import { FeatherEye } from "@subframe/core"
import Link from "next/link"
import { appUrl } from "@/const"
import type { SelectPublicUrlSchema } from "@/database/drizzle/schemas"
import { relativeDate } from "@/lib/relativeDate"
import { LinkButton } from "@/ui"
import { CopyButton } from "./CopyButton"

type UrlCardProps = z.infer<typeof SelectPublicUrlSchema>

export default function UrlCard(props: UrlCardProps) {
	const lastUpdated = relativeDate(props.updatedAt)

	// get the root domain only (i.e without 'https://')
	const domain = new URL(appUrl).host

	return (
		<div className="flex w-full items-start border-neutral-border border-b border-solid px-6 py-6">
			<div className="flex shrink-0 grow basis-0 flex-col items-start gap-4">
				<div className="flex w-full flex-col items-start gap-2">
					<div className="flex w-full items-center justify-between">
						<span className="font-body-bold text-body-bold text-default-font">
							{`${domain}/${props.shortUrl}`}
						</span>
						<CopyButton shortUrl={`${domain}/${props.shortUrl}`} />
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
						<span className="font-body text-body text-subtext-color">{`${props.clicksCount}`}</span>
					</div>
					<span className="font-body text-body text-subtext-color">•</span>
					<span className="font-body text-body text-subtext-color">{lastUpdated}</span>
				</div>
			</div>
		</div>
	)
}
