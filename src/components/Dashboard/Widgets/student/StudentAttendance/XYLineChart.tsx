
import {
    Axis,
    Grid,
    LineSeries,
    XYChart,
} from "@visx/xychart";
import React from "react";
import { useIntl } from "react-intl";

export interface LineChartData {
    x: string;
    y: number;
}

interface Props {
    data:LineChartData[];
    width:number;
    height:number;
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
        xAccessor: (d) => new Date(`${d.x}T00:00:00`),
        yAccessor: (d) => d.y,
    };

    return (
        <XYChart
            width={width}
            height={height}
            margin={{
                top: 30,
                bottom: 30,
                left: 50,
                right: 30,
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