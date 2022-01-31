import { defaultOptions } from "./defaultOptions";
import Donut from "./Donut";
import { Props } from "./typings";
import { Group } from "@visx/group";
import { ParentSize } from '@visx/responsive';
import { Text } from "@visx/text";
import React from "react";
import { useIntl } from "react-intl";

export default function DonutWithText (props: Props) {
    const intl = useIntl();
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
                            dy={0}
                            width={radiusWidth}
                            fontSize={12}
                            fontFamily={`Arial, Helvetica, sans-serif`}
                            fill="#6D8199">
                            {
                                intl.formatMessage({
                                    id: `home.attendance.pie.low`,
                                })
                            }
                        </Text>
                        <Text
                            textAnchor="middle"
                            dy={40}
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
