/** biome-ignore-all lint/a11y/noLabelWithoutControl: <input is the parent> */
"use client"

/*
 * Documentation:
 * Text Field — https://app.subframe.com/742f0f25ee8a/library?component=Text+Field_be48ca43-f8e7-4c0e-8870-d219ea11abfe
 */

import * as SubframeCore from "@subframe/core"
import React from "react"
import * as SubframeUtils from "../utils"

interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
	placeholder?: React.ReactNode
	value?: string
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	className?: string
}

export const TextFieldInput = React.forwardRef<HTMLElement, InputProps>(function Input(
	{ placeholder, className, ...otherProps }: InputProps,
	ref
) {
	return (
		<input
			className={SubframeUtils.twClassNames(
				"h-full w-full border-none bg-transparent font-body text-body text-default-font outline-none placeholder:text-neutral-400",
				className
			)}
			placeholder={placeholder as string}
			ref={ref as any}
			{...otherProps}
		/>
	)
})

interface TextFieldRootProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
	disabled?: boolean
	error?: boolean
	variant?: "outline" | "filled"
	label?: React.ReactNode
	helpText?: React.ReactNode
	icon?: React.ReactNode
	iconRight?: React.ReactNode
	children?: React.ReactNode
	className?: string
	htmlFor?: string
}

const TextFieldRoot = React.forwardRef<HTMLElement, TextFieldRootProps>(
	function TextFieldRoot(
		{
			disabled = false,
			error = false,
			variant = "outline",
			label,
			helpText,
			icon = null,
			iconRight = null,
			children,
			className,
			htmlFor = "",
			...otherProps
		}: TextFieldRootProps,
		ref
	) {
		return (
			<label
				className={SubframeUtils.twClassNames(
					"group/be48ca43 flex flex-col items-start gap-1",
					className
				)}
				ref={ref as any}
				htmlFor={htmlFor}
				{...otherProps}
			>
				{label ? (
					<span className="font-caption-bold text-caption-bold text-default-font">
						{label}
					</span>
				) : null}
				<div
					className={SubframeUtils.twClassNames(
						"flex h-10 w-full flex-none items-center gap-1 rounded-md border border-neutral-border border-solid bg-default-background px-2 group-focus-within/be48ca43:border group-focus-within/be48ca43:border-brand-primary group-focus-within/be48ca43:border-solid",
						{
							"border border-neutral-100 border-solid bg-neutral-100 group-focus-within/be48ca43:bg-default-background group-hover/be48ca43:border group-hover/be48ca43:border-neutral-border group-hover/be48ca43:border-solid":
								variant === "filled",
							"border border-error-600 border-solid": error,
							"border border-neutral-200 border-solid bg-neutral-200": disabled
						}
					)}
				>
					{icon ? (
						<SubframeCore.IconWrapper className="font-body text-body text-subtext-color">
							{icon}
						</SubframeCore.IconWrapper>
					) : null}
					{children ? (
						<div className="flex shrink-0 grow basis-0 flex-col items-start self-stretch px-1">
							{children}
						</div>
					) : null}
					{iconRight ? (
						<SubframeCore.IconWrapper
							className={SubframeUtils.twClassNames(
								"font-body text-body text-subtext-color",
								{ "text-error-500": error }
							)}
						>
							{iconRight}
						</SubframeCore.IconWrapper>
					) : null}
				</div>
				{helpText ? (
					<span
						className={SubframeUtils.twClassNames(
							"font-caption text-caption text-subtext-color",
							{ "text-error-700": error }
						)}
					>
						{helpText}
					</span>
				) : null}
			</label>
		)
	}
)

export const TextField = Object.assign(TextFieldRoot)
