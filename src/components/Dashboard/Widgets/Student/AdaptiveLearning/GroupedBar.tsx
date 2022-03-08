import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
    Box,
    Typography,
} from "@mui/material";
import {
    createTheme,
    Theme,
} from "@mui/material/styles";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import { HtmlLabel } from "@visx/annotation";
import { AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import {
    scaleBand,
    scaleLinear,
    scaleOrdinal,
} from "@visx/scale";
import {
    BarGroup,
    BarRounded,
} from "@visx/shape";
import React from "react";

export interface BarGroupChartData {
    skill: string;
    WithoutReview: number;
    WithReview: number;
}

interface Props {
    data: BarGroupChartData[];
    width: number;
    height: number;
    colorRange: string[];
    windowWidth: number;
}

type ReviewTypes = "WithReview" | "WithoutReview";

export default function GroupedBar (props: Props) {
    const {
        data,
        width,
        height,
        colorRange,
        windowWidth,
    } = props;
    const theme = createTheme();
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            totalLabelWrapper: {
                height: 38,
                display: `flex`,
                flexDirection: `column`,
                justifyContent: `center`,
            },
            totalLabelTitle: {
                margin: 0,
                display: `flex`,
                alignItems: `center`,
                justifyContent: `center`,
                fontSize: 12,
                fontWeight: 400,
                textAlign: `center`,
                height: 11,
            },
            totalLabelSubtitle: {
                margin: 0,
                display: `flex`,
                alignItems: `center`,
                justifyContent: `center`,
                fontSize: 18,
                fontWeight: 700,
                textAlign: `center`,
                height: 14,
                letterSpacing: -0.5,
            },
            legendWrapper: {
                position: `absolute`,
                top: 3,
                height: 14,
                display: `flex`,
                justifyContent: `space-between`,
                alignItems: `center`,
            },
            legendItemWrapper: {
                display: `flex`,
                alignItems: `center`,
                justifyContent: `center`,
                height: 14,
            },
            legendLabelText: {
                fontWeight: 400,
                margin: 0,
                [theme.breakpoints.down(`sm`)]: {
                    fontSize: 10,
                },
                fontSize: 12,
                color: theme.palette.grey[400],
            },
            legendTitle: {
                [theme.breakpoints.down(`sm`)]: {
                    fontSize: 12,
                },
                fontSize: 14,
            },
            annotationLabelBackground: {
                width: 65,
                height: 32,
                backgroundColor: theme.palette.info.light,
                opacity: 0.2,
                position: `absolute`,
                borderRadius: 15,
                borderBottomLeftRadius: 6,
            },
            annotationLabelText: {
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: -0.5,
                display: `flex`,
                alignItems: `center`,
                justifyContent: `space-around`,
            },
            htmlLabelTextWrapperForBarValue: {
                display: `flex`,
                alignItems: `center`,
                justifyContent: `center`,
                padding: theme.spacing(.5),
            },
            htmlLabelTextForBarValue: {
                fontSize: `.8rem`,
                color: `#FFFFF`,
                fontWeight: 600,
                paddingTop:theme.spacing(.75),
                letterSpacing: `-0.5px`,
                [theme.breakpoints.down(`sm`)]: {
                    fontSize: `.65rem`,
                },
                [theme.breakpoints.down(`md`)]: {
                    fontSize: `.65rem`,
                },
            },
        }));
    const classes = useStyles();
    const margin = {
        top: 60,
        bottom: windowWidth < theme.breakpoints.values.sm ? 30 : 20,
        left: 10,
        right: 10,
    };
    const keys = Object.keys(data[0]).filter((d) => d !== `skill`) as ReviewTypes[];

    interface DataObj {
        skill: string;
    }

    // Axis Bottom Label Props
    const bottomTickLabelProps = () =>
        ({
            fontSize: 14,
            letterSpacing: -0.5,
            fontWeight: 600,
            lineHeight: 16,
            fill: theme.palette.grey[800],
            textAnchor: `middle`,
        } as const);
    // Annotation Label Props
    const htmlLabelContainerStylesForAnnotationLabel = {
        width: 50,
        height: 32,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        borderRadius: 20,
        borderBottomLeftRadius: 6,
    };
    // accessors
    const getX = (d: DataObj) => d.skill;
    // scales
    const x0Scale = scaleBand<string>({
        domain: data.map(getX),
        padding: 0.2,
    });
    const x1Scale = scaleBand<string>({
        domain: keys,
    });
    const yScale = scaleLinear<number>({
        domain: [ 0, Math.max(...data.map((d) => Math.max(...keys.map((key) => Number(d[key]))))) ],
    });
    const colorScale = scaleOrdinal<string, string>({
        domain: keys,
        range: colorRange,
    });
    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;
    // update scale output dimensions
    x0Scale.rangeRound([ 0, xMax ]);
    x1Scale.rangeRound([ 0, x0Scale.bandwidth() ]);
    yScale.range([ yMax, 0 ]);

    return width < 10 ? null : (
        <Box
            sx={{
                position: `relative`,
            }}
        >
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${height}`}>
                <Group
                    top={margin.top}
                    left={margin.left}>
                    <BarGroup
                        data={data}
                        keys={keys}
                        height={yMax}
                        x0={getX}
                        x0Scale={x0Scale}
                        x1Scale={x1Scale}
                        yScale={yScale}
                        color={colorScale}
                    >
                        {(barGroups) =>
                            barGroups.map((barGroup) => {
                                const { bars } = barGroup;
                                const [ bar1, bar2 ] = bars;
                                const diff = Math.abs(bar1.value - bar2.value);
                                const highest = bar1.value > bar2.value ? bar1 : bar2;

                                return (
                                    <Group
                                        key={`bar-group-${barGroup.index}-${barGroup.x0}`}
                                        left={barGroup.x0}
                                    >
                                        <HtmlLabel
                                            containerStyle={
                                                htmlLabelContainerStylesForAnnotationLabel
                                            }
                                            horizontalAnchor="end"
                                            verticalAnchor="start"
                                            anchorLineStroke="none"
                                            x={highest.x + highest.width}
                                            y={highest.y - 40}
                                        >
                                            <Box className={classes.annotationLabelBackground} />
                                            <Typography
                                                variant="body2"
                                                color={theme.palette.info.light}
                                                className={classes.annotationLabelText}
                                            >
                                                {`${diff}%`}
                                                <ArrowDropUpIcon />
                                            </Typography>
                                        </HtmlLabel>
                                        {barGroup.bars.map((bar) => {
                                            return (
                                                <Group key={bar.index}>
                                                    <BarRounded
                                                        x={bar.x}
                                                        y={bar.y}
                                                        width={bar.width}
                                                        height={bar.height}
                                                        fill={bar.color}
                                                        radius={12}
                                                        top={true}
                                                    />

                                                    <HtmlLabel
                                                        horizontalAnchor="start"
                                                        verticalAnchor="start"
                                                        anchorLineStroke="none"
                                                        x={bar?.x}
                                                        y={bar?.y}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: bar.width,
                                                            }}
                                                            className={
                                                                classes.htmlLabelTextWrapperForBarValue
                                                            }
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                color="white"
                                                                className={classes.htmlLabelTextForBarValue}
                                                            >
                                                                {bar.value + `%`}
                                                            </Typography>
                                                        </Box>
                                                    </HtmlLabel>
                                                </Group>
                                            );
                                        })}
                                    </Group>
                                );
                            })
                        }
                    </BarGroup>
                </Group>
                <AxisBottom
                    hideAxisLine
                    hideTicks
                    top={yMax + margin.top - 5}
                    left={margin.left}
                    scale={x0Scale}
                    tickLabelProps={bottomTickLabelProps}
                />
            </svg>
        </Box>
    );
}
