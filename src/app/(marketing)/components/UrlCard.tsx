import type { z } from "@hono/zod-openapi"
import { FeatherCopy, FeatherEye } from "@subframe/core"
import relativeDate from "tiny-relative-date"
import type { SelectPublicUrlSchema } from "@/backend/database/drizzle/schemas"
import { IconButton, LinkButton } from "@/ui"

type UrlCardProps = z.infer<typeof SelectPublicUrlSchema>

const HOST_NAME = "localhost:3000"

export default function UrlCard(props: UrlCardProps) {
	const lastUpdated = relativeDate(new Date(props.updatedAt))

	return (
		<div className="flex w-full items-start border-neutral-border border-b border-solid px-6 py-6">
			<div className="flex shrink-0 grow basis-0 flex-col items-start gap-4">
				<div className="flex w-full flex-col items-start gap-2">
					<div className="flex w-full items-center justify-between">
						<span className="font-body-bold text-body-bold text-default-font">
							{`${HOST_NAME}/${props.shortUrl}`}
						</span>
						<IconButton
							icon={<FeatherCopy />}
							// onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
						/>
					</div>
					<LinkButton
					// onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
					>
						{props.originalUrl}
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
