import { defaultOptions } from "./defaultOptions";
import { Props } from "./typings";
import { Pie } from "@visx/shape";
import React from "react";

export default function Donut (props: Props) {
    const {
        data,
        options: {
            pieSize = defaultOptions.pieSize,
            cornerRadius = defaultOptions.cornerRadius,
            radiusWidth = defaultOptions.radiusWidth,
            padAngle = defaultOptions.padAngle,
        } = defaultOptions,
    } = props;

    return (
        <Pie
            data={data}
            pieValue={(data) => data.value!}
            outerRadius={pieSize}
            innerRadius={pieSize - radiusWidth}
            cornerRadius={cornerRadius}
            padAngle={padAngle}
        >
            {(pie) => {
                return pie.arcs.map((arc) => {
                    return (
                        <g key={arc.data.label} >
                            <path
                                d={pie.path(arc)!}
                                fill={arc.data.color}>
                            </path>
                        </g>
                    );
                });
            }}
        </Pie>
    );
}
