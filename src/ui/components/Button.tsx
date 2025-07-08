"use client"

/*
 * Documentation:
 * Button — https://app.subframe.com/742f0f25ee8a/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 */

import { Slot } from "@radix-ui/react-slot"
import * as SubframeCore from "@subframe/core"
import React from "react"
import * as SubframeUtils from "../utils"

interface ButtonRootProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?:
		| "brand-primary"
		| "brand-secondary"
		| "brand-tertiary"
		| "neutral-primary"
		| "neutral-secondary"
		| "neutral-tertiary"
		| "destructive-primary"
		| "destructive-secondary"
		| "destructive-tertiary"
		| "inverse"
	size?: "large" | "medium" | "small"
	children?: React.ReactNode
	icon?: React.ReactNode
	iconRight?: React.ReactNode
	loading?: boolean
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
	className?: string
	asChild?: boolean
}

const ButtonRoot = React.forwardRef<HTMLElement, ButtonRootProps>(function ButtonRoot(
	{
		variant = "brand-primary",
		size = "medium",
		children,
		icon = null,
		iconRight = null,
		loading = false,
		className,
		type = "button",
		asChild = false,
		...otherProps
	}: ButtonRootProps,
	ref
) {
	const Comp = asChild ? Slot : "button"

	if (asChild) {
		return (
			<Comp
				data-slot="button"
				className={SubframeUtils.twClassNames(
					"group/3b777358 flex h-8 cursor-pointer items-center justify-center gap-2 rounded-md border-none bg-brand-600 px-3 hover:bg-brand-500 active:bg-brand-600 disabled:cursor-default disabled:bg-neutral-200 active:disabled:cursor-default active:disabled:bg-neutral-200 hover:disabled:cursor-default hover:disabled:bg-neutral-200",
					{
						"h-6 w-auto flex-row flex-nowrap gap-1 px-2 py-0": size === "small",
						"h-10 w-auto px-4 py-0": size === "large",
						"bg-transparent hover:bg-[#ffffff29] active:bg-[#ffffff3d]":
							variant === "inverse",
						"bg-transparent hover:bg-error-50 active:bg-error-100":
							variant === "destructive-tertiary",
						"bg-error-50 hover:bg-error-100 active:bg-error-50":
							variant === "destructive-secondary",
						"bg-error-600 hover:bg-error-500 active:bg-error-600":
							variant === "destructive-primary",
						"bg-transparent hover:bg-neutral-100 active:bg-neutral-200":
							variant === "neutral-tertiary",
						"border border-neutral-border border-solid bg-default-background hover:bg-neutral-50 active:bg-default-background":
							variant === "neutral-secondary",
						"bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-100":
							variant === "neutral-primary",
						"bg-transparent hover:bg-brand-50 active:bg-brand-100":
							variant === "brand-tertiary",
						"bg-brand-50 hover:bg-brand-100 active:bg-brand-50":
							variant === "brand-secondary",

						"font-caption-bold text-caption-bold": size === "small",
						"font-body-bold text-body-bold": size === "large",
						"text-white": variant === "inverse",
						"text-error-700":
							variant === "destructive-tertiary" || variant === "destructive-secondary",
						"text-neutral-700":
							variant === "neutral-tertiary" ||
							variant === "neutral-secondary" ||
							variant === "neutral-primary",
						"text-brand-700":
							variant === "brand-tertiary" || variant === "brand-secondary"
					},
					className
				)}
				ref={ref as any}
				{...otherProps}
			>
				{children}
			</Comp>
		)
	}

	return (
		<Comp
			data-slot="button"
			className={SubframeUtils.twClassNames(
				"group/3b777358 flex h-8 cursor-pointer items-center justify-center gap-2 rounded-md border-none bg-brand-600 px-3 hover:bg-brand-500 active:bg-brand-600 disabled:cursor-default disabled:bg-neutral-200 active:disabled:cursor-default active:disabled:bg-neutral-200 hover:disabled:cursor-default hover:disabled:bg-neutral-200",
				{
					"h-6 w-auto flex-row flex-nowrap gap-1 px-2 py-0": size === "small",
					"h-10 w-auto px-4 py-0": size === "large",
					"bg-transparent hover:bg-[#ffffff29] active:bg-[#ffffff3d]":
						variant === "inverse",
					"bg-transparent hover:bg-error-50 active:bg-error-100":
						variant === "destructive-tertiary",
					"bg-error-50 hover:bg-error-100 active:bg-error-50":
						variant === "destructive-secondary",
					"bg-error-600 hover:bg-error-500 active:bg-error-600":
						variant === "destructive-primary",
					"bg-transparent hover:bg-neutral-100 active:bg-neutral-200":
						variant === "neutral-tertiary",
					"border border-neutral-border border-solid bg-default-background hover:bg-neutral-50 active:bg-default-background":
						variant === "neutral-secondary",
					"bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-100":
						variant === "neutral-primary",
					"bg-transparent hover:bg-brand-50 active:bg-brand-100":
						variant === "brand-tertiary",
					"bg-brand-50 hover:bg-brand-100 active:bg-brand-50":
						variant === "brand-secondary"
				},
				className
			)}
			ref={ref as any}
			type={type}
			{...otherProps}
		>
			{icon ? (
				<SubframeCore.IconWrapper
					className={SubframeUtils.twClassNames(
						"font-body text-body text-white group-disabled/3b777358:text-neutral-400",
						{
							hidden: loading,
							"font-body text-body": size === "small",
							"font-heading-3 text-heading-3": size === "large",
							"text-white": variant === "inverse",
							"text-error-700":
								variant === "destructive-tertiary" || variant === "destructive-secondary",
							"text-neutral-700":
								variant === "neutral-tertiary" ||
								variant === "neutral-secondary" ||
								variant === "neutral-primary",
							"text-brand-700":
								variant === "brand-tertiary" || variant === "brand-secondary"
						}
					)}
				>
					{icon}
				</SubframeCore.IconWrapper>
			) : null}
			<div
				className={SubframeUtils.twClassNames(
					"hidden h-4 w-4 flex-none items-center justify-center gap-2",
					{ flex: loading, "h-3 w-3 flex-none": size === "small" }
				)}
			>
				<SubframeCore.Loader
					className={SubframeUtils.twClassNames(
						"font-caption text-caption text-white group-disabled/3b777358:text-neutral-400",
						{
							"inline-block font-['Inter'] font-[400] text-[12px] leading-[20px] tracking-normal":
								loading,
							"font-caption text-caption": size === "small",
							"text-error-700":
								variant === "destructive-tertiary" || variant === "destructive-secondary",
							"text-neutral-700":
								variant === "neutral-tertiary" ||
								variant === "neutral-secondary" ||
								variant === "neutral-primary",
							"text-brand-700":
								variant === "brand-tertiary" || variant === "brand-secondary"
						}
					)}
				/>
			</div>
			{children ? (
				<span
					className={SubframeUtils.twClassNames(
						"whitespace-nowrap font-body-bold text-body-bold text-white group-disabled/3b777358:text-neutral-400",
						{
							hidden: loading,
							"font-caption-bold text-caption-bold": size === "small",
							"font-body-bold text-body-bold": size === "large",
							"text-white": variant === "inverse",
							"text-error-700":
								variant === "destructive-tertiary" || variant === "destructive-secondary",
							"text-neutral-700":
								variant === "neutral-tertiary" ||
								variant === "neutral-secondary" ||
								variant === "neutral-primary",
							"text-brand-700":
								variant === "brand-tertiary" || variant === "brand-secondary"
						}
					)}
				>
					{children}
				</span>
			) : null}
			{iconRight ? (
				<SubframeCore.IconWrapper
					className={SubframeUtils.twClassNames(
						"font-body text-body text-white group-disabled/3b777358:text-neutral-400",
						{
							"font-body text-body": size === "small",
							"font-heading-3 text-heading-3": size === "large",
							"text-white": variant === "inverse",
							"text-error-700":
								variant === "destructive-tertiary" || variant === "destructive-secondary",
							"text-neutral-700":
								variant === "neutral-tertiary" ||
								variant === "neutral-secondary" ||
								variant === "neutral-primary",
							"text-brand-700":
								variant === "brand-tertiary" || variant === "brand-secondary"
						}
					)}
				>
					{iconRight}
				</SubframeCore.IconWrapper>
			) : null}
		</Comp>
	)
})

export const Button = ButtonRoot
