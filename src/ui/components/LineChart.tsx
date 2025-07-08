"use client";
/*
 * Documentation:
 * Line Chart — https://app.subframe.com/742f0f25ee8a/library?component=Line+Chart_22944dd2-3cdd-42fd-913a-1b11a3c1d16d
 */

import React from "react";
import * as SubframeUtils from "../utils";
import * as SubframeCore from "@subframe/core";

interface LineChartRootProps
  extends React.ComponentProps<typeof SubframeCore.LineChart> {
  className?: string;
}

const LineChartRoot = React.forwardRef<HTMLElement, LineChartRootProps>(
  function LineChartRoot(
    { className, ...otherProps }: LineChartRootProps,
    ref
  ) {
    return (
      <SubframeCore.LineChart
        className={SubframeUtils.twClassNames("h-80 w-full", className)}
        ref={ref as any}
        colors={[
          "#22c55e",
          "#bbf7d0",
          "#16a34a",
          "#86efac",
          "#15803d",
          "#4ade80",
        ]}
        {...otherProps}
      />
    );
  }
);

export const LineChart = LineChartRoot;
