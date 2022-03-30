import { createTheme } from "@mui/material/styles";
import { Marker } from "@visx/marker";
import React from "react";

interface Props {
    isVerticalMode : boolean;
}

export default function Markers (props : Props) {

    const { isVerticalMode } = props;
    const theme = createTheme();

    return (
        <defs>
            <Marker
                id="arrowDown1"
                viewBox="0 0 10 10"
                markerWidth="1.6"
                markerHeight="1.6"
                markerUnits="strokeWidth"
                refX={isVerticalMode ? `22.5` : `25`}
                refY={isVerticalMode ? `2` : `0`}
                orient="auto">
                <path
                    style={{
                        transform : `rotate(-20deg)`,
                    }}
                    d="M 0 0 L 6 5 L 0 10 z"
                    fill={theme.palette.warning.light}/>
            </Marker>
            <Marker
                id="arrowUp1"
                viewBox="0 0 10 10"
                refX={isVerticalMode ? `-24` : `-11.5`}
                refY={isVerticalMode ? `1` : `4`}
                markerUnits="strokeWidth"
                markerWidth="1.6"
                markerHeight="1.6"
                orient="auto">
                <path
                    d="M 0 0 L 6 6 L 0 10 z"
                    fill="#F7FF55"/>
            </Marker>
            <Marker
                id="arrowDown2"
                viewBox="0 0 10 10"
                markerWidth="1.6"
                markerHeight="1.6"
                markerUnits="strokeWidth"
                refX={isVerticalMode ? `26.5` : `14`}
                refY={isVerticalMode ? `1` : `3.5`}
                orient="auto">
                <path
                    style={{
                        transform : `rotate(-10deg)`,
                    }}
                    d="M 0 0 L 6 5 L 0 10 z"
                    fill={theme.palette.warning.light}/>
            </Marker>
            <Marker
                id="arrowUp2"
                viewBox="0 0 10 10"
                refX={isVerticalMode ? `-18` : `-21`}
                refY={isVerticalMode ? `2.5` : `1`}
                markerUnits="strokeWidth"
                markerWidth="1.6"
                markerHeight="1.6"
                orient="auto">
                <path
                    style={{
                        transform : `rotate(10deg)`,
                    }}
                    d="M 0 0 L 6 5.5 L 0 10 z"
                    fill="#F7FF55"/>
            </Marker>
            <linearGradient
                id="solids"
                x1={isVerticalMode ? `100%` : `0%`}
                y1="0%"
                x2="0%"
                y2={isVerticalMode ? `0%` : `100%`}>
                <stop
                    offset="0%"
                    stopColor={theme.palette.warning.light} />
                <stop
                    offset="50%"
                    stopColor={theme.palette.warning.light} />
                <stop
                    offset="50%"
                    stopColor={`#F7FF55`} />
                <stop
                    offset="100%"
                    stopColor={`#F7FF55`} />
            </linearGradient>
        </defs>
    );
}
