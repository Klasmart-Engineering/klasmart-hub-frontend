import { defaultOptions } from "./defaultOptions";
import Donut from "./Donut";
import { Props } from "./typings";
import { Group } from "@visx/group";
import { ParentSize } from '@visx/responsive';
import { Text } from "@visx/text";
import React from "react";

export default function DonutWithText (props: Props) {
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
        <ParentSize>
            {({ width, height }) => (
                <svg
                    width={width}
                    height={height}>
                    <Group
                        top={height/2}
                        left={width/2}>
                        <Donut
                            data={data}
                            options={{
                                pieSize,
                                cornerRadius,
                                radiusWidth,
                                padAngle,
                            }}/>
                        <Text
                            textAnchor="middle"
                            dy={-25}
                            fontSize={12}
                            fontFamily={`Arial, Helvetica, sans-serif`}
                            fill="#6D8199">
                Students with
                        </Text>
                        <Text
                            textAnchor="middle"
                            dy={-10}
                            fontSize={12}
                            fontFamily={`Arial, Helvetica, sans-serif`}
                            fill="#6D8199">
                low attendance
                        </Text>
                        <Text
                            textAnchor="middle"
                            dy={30}
                            fontSize={36}
                            fontFamily={`Arial, Helvetica, sans-serif`}
                            fill={`#EF0261`}>
                            {data[2].count}
                        </Text>
                    </Group>
                </svg>
            )}
        </ParentSize>
    );
}
