
import {
    Axis,
    Grid,
    LineSeries,
    XYChart,
} from "@visx/xychart";
import React from "react";
import { useIntl } from "react-intl";

export interface LineChartData {
    class_date: string;
    rate: number;
}

interface Props {
    data: LineChartData[];
    width: number;
    height: number;
    color: any;
}

export default function XYLineChart (props: Props) {
    const {
        data,
        width,
        height,
        color,
    } = props;

    const intl = useIntl();
    const approximateYrows = 3;

    const accessors = {
        xAccessor: (d: LineChartData) => new Date(`${d.class_date}T00:00:00`),
        yAccessor: (d: LineChartData) => d.rate,
    };

    /**
    - Original JIRA issue: https://calmisland.atlassian.net/browse/DT-655.
    - Visx open issue on 16.02.22: https://github.com/airbnb/visx/issues/1014 it's possibly combination of
    parentsize and xychart issue as other graphics don't face this problem.
    - Don't delete widthAdjustmentForResizing, specifically for width={...} because without it when we resize
    the widget never adjusts to the container width/height.
    */

    const widthAdjustmentForResizing = 20;

    return (
        <XYChart
            width={width - widthAdjustmentForResizing}
            height={height}
            margin={{
                top: 30,
                bottom: 30,
                left: 50,
                right: 30 - widthAdjustmentForResizing,
            }}
            xScale={{
                type: `time`,
            }}
            yScale={{
                type: `linear`,
            }}
        >
            <Grid
                columns={false}
                numTicks={approximateYrows}
                lineStyle={{
                    stroke: `#e1e1e1`,
                    strokeLinecap: `round`,
                    strokeWidth: 1,
                }}
                strokeDasharray="3"
            />
            <Axis
                hideTicks
                orientation="bottom"
                strokeWidth={1}
                tickLabelProps={() => ({
                    dx: -10,
                    dy: 5,
                })}
                tickFormat={(date) =>{
                    return intl.formatDate(date, {
                        month: `2-digit`,
                        day: `2-digit`,
                    });
                }}
                numTicks={4}
            />
            <Axis
                hideAxisLine
                hideTicks
                orientation="left"
                numTicks={approximateYrows}
                tickLabelProps={() => ({
                    dx: -10,
                    dy: -5,
                })}
                tickFormat={(number) =>{
                    return `${number*100}%`;
                }}
            />
            <LineSeries
                stroke={color}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth={3}
                dataKey="primary_line"
                data={data}
                {...accessors}
            />
        </XYChart>
    );
}
