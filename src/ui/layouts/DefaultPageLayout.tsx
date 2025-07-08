"use client"
/*
 * Documentation:
 * Default Page Layout — https://app.subframe.com/742f0f25ee8a/library?component=Default+Page+Layout_a57b1c43-310a-493f-b807-8cc88e2452cf
 */

import React from "react"
import * as SubframeUtils from "../utils"

interface DefaultPageLayoutRootProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode
	className?: string
}

const DefaultPageLayoutRoot = React.forwardRef<HTMLElement, DefaultPageLayoutRootProps>(
	function DefaultPageLayoutRoot(
		{ children, className, ...otherProps }: DefaultPageLayoutRootProps,
		ref
	) {
		return (
			<div
				className={SubframeUtils.twClassNames(
					"flex h-screen w-full items-center",
					className
				)}
				ref={ref as any}
				{...otherProps}
			>
				{children ? (
					<div className="flex shrink-0 grow basis-0 flex-col items-start gap-2 self-stretch overflow-y-auto bg-default-background">
						{children}
					</div>
				) : null}
			</div>
		)
	}
)

export const DefaultPageLayout = DefaultPageLayoutRoot
