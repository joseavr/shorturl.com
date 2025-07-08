"use client"

/*
 * Documentation:
 * Link Button — https://app.subframe.com/742f0f25ee8a/library?component=Link+Button_a4ee726a-774c-4091-8c49-55b659356024
 */

import * as SubframeCore from "@subframe/core"
import React from "react"
import * as SubframeUtils from "../utils"

interface LinkButtonRootProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "brand" | "neutral" | "inverse"
	size?: "large" | "medium" | "small"
	icon?: React.ReactNode
	children?: React.ReactNode
	iconRight?: React.ReactNode
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
	className?: string
}

const LinkButtonRoot = React.forwardRef<HTMLElement, LinkButtonRootProps>(
	function LinkButtonRoot(
		{
			variant = "neutral",
			size = "medium",
			icon = null,
			children,
			iconRight = null,
			className,
			type = "button",
			...otherProps
		}: LinkButtonRootProps,
		ref
	) {
		return (
			<button
				className={SubframeUtils.twClassNames(
					"group/a4ee726a flex cursor-pointer items-center gap-1 border-none bg-transparent",
					{ "flex-row flex-nowrap gap-1": size === "large" },
					className
				)}
				ref={ref as any}
				type={type}
				{...otherProps}
			>
				{icon ? (
					<SubframeCore.IconWrapper
						className={SubframeUtils.twClassNames(
							"font-body text-body text-neutral-700 group-hover/a4ee726a:text-brand-700 group-disabled/a4ee726a:text-neutral-400 group-hover/a4ee726a:group-disabled/a4ee726a:text-neutral-400",
							{
								"font-caption text-caption": size === "small",
								"font-heading-3 text-heading-3": size === "large",
								"text-white group-hover/a4ee726a:text-white": variant === "inverse",
								"text-brand-700 group-hover/a4ee726a:text-brand-700": variant === "brand"
							}
						)}
					>
						{icon}
					</SubframeCore.IconWrapper>
				) : null}
				{children ? (
					<span
						className={SubframeUtils.twClassNames(
							"font-body text-body text-neutral-700 group-hover/a4ee726a:text-brand-700 group-hover/a4ee726a:underline group-disabled/a4ee726a:text-neutral-400 group-hover/a4ee726a:group-disabled/a4ee726a:text-neutral-400 group-hover/a4ee726a:group-disabled/a4ee726a:no-underline",
							{
								"font-caption text-caption": size === "small",
								"font-heading-3 text-heading-3": size === "large",
								"text-white group-hover/a4ee726a:text-white": variant === "inverse",
								"text-brand-700 group-hover/a4ee726a:text-brand-700": variant === "brand"
							}
						)}
					>
						{children}
					</span>
				) : null}
				{iconRight ? (
					<SubframeCore.IconWrapper
						className={SubframeUtils.twClassNames(
							"font-body text-body text-neutral-700 group-hover/a4ee726a:text-brand-700 group-disabled/a4ee726a:text-neutral-400 group-hover/a4ee726a:group-disabled/a4ee726a:text-neutral-400",
							{
								"font-caption text-caption": size === "small",
								"font-heading-3 text-heading-3": size === "large",
								"text-white group-hover/a4ee726a:text-white": variant === "inverse",
								"text-brand-700 group-hover/a4ee726a:text-brand-700": variant === "brand"
							}
						)}
					>
						{iconRight}
					</SubframeCore.IconWrapper>
				) : null}
			</button>
		)
	}
)

export const LinkButton = LinkButtonRoot
