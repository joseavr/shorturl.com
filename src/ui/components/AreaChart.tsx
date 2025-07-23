"use client"

/*
 * Documentation:
 * Area Chart — https://app.subframe.com/742f0f25ee8a/library?component=Area+Chart_8aa1e7b3-5db6-4a62-aa49-137ced21a231
 */

import * as SubframeCore from "@subframe/core"
import React from "react"
import * as SubframeUtils from "../utils"

interface AreaChartRootProps extends React.ComponentProps<typeof SubframeCore.AreaChart> {
	stacked?: boolean
	className?: string
}

const AreaChartRoot = React.forwardRef<HTMLElement, AreaChartRootProps>(
	function AreaChartRoot(
		{ stacked = false, className, ...otherProps }: AreaChartRootProps,
		ref
	) {
		return (
			<SubframeCore.AreaChart
				className={SubframeUtils.twClassNames("h-80 w-full", className)}
				ref={ref as any}
				stacked={stacked}
				colors={["#22c55e", "#86efac", "#14b8a6", "#65a30d", "#cae926"]}
				{...otherProps}
			/>
		)
	}
)

export const AreaChart = AreaChartRoot
