import ChartLegend from "./ChartLegend";
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
import {
    AxisBottom,
    AxisLeft,
} from "@visx/axis";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import {
    scaleBand,
    scaleLinear,
    scaleOrdinal,
} from "@visx/scale";
import {
    BarRounded,
    BarStack,
} from "@visx/shape";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        totalLabelWrapper: {
            background: theme.palette.success.light,
            borderRadius: 18,
            borderBottomLeftRadius: 6,
            display: `grid`,
            placeContent: `center`,
            padding: `0.35rem 0.45rem`,
        },
        totalLabelTitle: {
            fontSize: `0.7rem`,
            textAlign: `center`,
            lineHeight: `0.5rem`,
            padding: `0.15rem`,
        },
        totalLabelSubtitle: {
            fontSize: `0.85rem`,
            textAlign: `center`,
            lineHeight: `0.5rem`,
            padding: `0.15rem`,
            fontWeight: 700,
            letterSpacing: -0.5,
        },
        htmlLabelTextWrapperForBarValue: {
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
        },
        htmlLabelTextForBarValue: {
            fontSize: `0.6rem`,
            color: theme.palette.common.white,
            fontWeight: 600,
            letterSpacing: -0.5,
        },
    }));

const roundNumber = (num: number) => Math.round((num / 10) * 10);
const LEFT_AXIS_BREAKPOINT = 400;
interface Data {
    skill: string;
    achieved: number;
    notAchieved: number;
}
interface Props {
    data: Data[];
    width: number;
    height: number;
}

export default function BarChart (props: Props) {
    const {
        data,
        width,
        height,
    } = props;
    const intl = useIntl();
    const classes = useStyles();
    const theme = createTheme();
    const margin = {
        top: 60,
        bottom: 50,
        left: width < LEFT_AXIS_BREAKPOINT ? 0 : 10,
        right: 10,
    };

    const totalLabel = intl.formatMessage({
        id: `home.student.learningOutcomeWidget.totalLabel`,
    });
    const innerWidth = width - margin.left;
    const innerHeight = height - margin.bottom;
    const achievedColor = theme.palette.info.light;
    const notAchievedColor = theme.palette.error.light;
    const barRadius = 6;
    const keys = Object.keys(data[0] || {}).filter((d) => d !== `skill`);
    const achievementTotals = data.reduce((totals, skill) => {
        totals.push(skill.achieved + skill.notAchieved);
        return totals;
    }, [] as number[]);
    const maxScore = roundNumber(Math.max(...achievementTotals));
    const axisLeftNumTick = 4;

    const getSkill = (d: Data) => d.skill;
    // Defining scales
    const xScale = scaleBand<string>({
        range: [ margin.left, innerWidth ],
        domain: data.map(getSkill),
        padding: .7,
    });
    const yScale = scaleLinear<number>({
        domain: [ 0, maxScore ],
        range: [ innerHeight, margin.top ],
    });
    const colorRange = [ achievedColor, notAchievedColor ];
    const colorScale = scaleOrdinal({
        domain: data.map(getSkill),
        range: data.length % 2 === 0 ? colorRange : colorRange.reverse(),
    });

    // Axis Tick Label Props
    const bottomTickLabelProps = () =>
        ({
            fontSize: width < LEFT_AXIS_BREAKPOINT ? `0.6rem` : `0.75rem`,
            letterSpacing: -0.5,
            fontWeight: 600,
            width: 80,
            dy: -10,
            textAnchor: `middle`,
            verticalAnchor: `start`,
        } as const);
    const leftTickLabelProps = () =>
        ({
            fontSize: 12,
            fontWeight: 400,
            fill: theme.palette.grey[500],
            dx: 7,
            dy: -5,
        } as const);

    return (
        <Box
            sx={{
                position: `relative`,
            }}
        >
            <ChartLegend
                width={width}
                height={height}
                dataLength={data?.length}
                colorRange={colorRange}
            />
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${height}`}
            >
                {/* Chart Background */}
                <rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill={theme.palette.common.white}
                    rx={12}
                />

                {/* Chart Grid Lines */}
                <GridRows
                    scale={yScale}
                    left={margin.left}
                    width={innerWidth - margin.left}
                    height={innerHeight - margin.top}
                    fill={theme.palette.grey[300]}
                    strokeDasharray="3"
                    numTicks={axisLeftNumTick}
                />

                {/* Axis Bottom */}
                <Group>
                    <AxisBottom
                        hideTicks
                        top={innerHeight}
                        scale={xScale}
                        tickLabelProps={bottomTickLabelProps}
                        stroke={theme.palette.grey[300]}
                    />
                </Group>
                {/* Axis Bottom */}

                {/* Axis Left */}
                <Group>
                    {width > LEFT_AXIS_BREAKPOINT ?
                        (
                            <AxisLeft
                                hideTicks
                                hideAxisLine
                                left={margin.left}
                                scale={yScale}
                                tickLabelProps={leftTickLabelProps}
                                numTicks={axisLeftNumTick}
                            />
                        ) : <></>}
                </Group>
                {/* Axis Left */}

                {/* Chart Bars */}
                <Group>
                    <BarStack
                        data={data}
                        keys={keys}
                        x={getSkill}
                        xScale={xScale}
                        yScale={yScale}
                        color={colorScale}
                        offset={`none`}
                    >
                        {(barStacks) =>
                            barStacks.map((barStack) =>
                                barStack.bars.map(({
                                    x, y, height, color, bar, index, width,
                                }) => {
                                    return (
                                        <Group key={`bar-stack-${barStack.index}-${index}`}>
                                            <BarRounded
                                                height={height}
                                                radius={barRadius}
                                                width={width}
                                                x={x}
                                                y={y}
                                                fill={color}
                                                top={
                                                    barStack.key === `notAchieved` ||
                                                        bar?.data?.notAchieved === 0
                                                        ? true
                                                        : false
                                                }
                                            />
                                            <HtmlLabel
                                                horizontalAnchor="start"
                                                verticalAnchor="start"
                                                anchorLineStroke="none"
                                                x={x}
                                                y={
                                                    barStack.key === `notAchieved` ? y - 43 : y
                                                }
                                            >
                                                {color === notAchievedColor ? (
                                                    <Box className={classes.totalLabelWrapper}>
                                                        <Typography
                                                            variant="caption"
                                                            color={theme.palette.common.white}
                                                            className={classes.totalLabelTitle}
                                                        >
                                                            {totalLabel}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color={theme.palette.common.white}
                                                            className={classes.totalLabelSubtitle}
                                                        >
                                                            {bar?.data?.achieved +
                                                                bar?.data?.notAchieved}
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            width: width,
                                                        }}
                                                        className={
                                                            classes.htmlLabelTextWrapperForBarValue
                                                        }
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            color={theme.palette.common.white}
                                                            className={classes.htmlLabelTextForBarValue}
                                                        >
                                                            {!!bar?.data?.achieved && bar.data.achieved}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </HtmlLabel>
                                        </Group>
                                    );
                                }))
                        }
                    </BarStack>
                </Group>
                {/* Chart Bars */}
            </svg>
        </Box>
    );
}
