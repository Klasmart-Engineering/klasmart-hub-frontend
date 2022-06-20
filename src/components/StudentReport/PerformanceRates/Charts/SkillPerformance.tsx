import { GroupNameAll } from "../DataFormatter";
import {
    Box,
    lighten,
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
    BarGroup,
    BarRounded,
    BarStack,
} from "@visx/shape";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        totalLabelCont: {
            display: `grid`,
        },
        totalLabelWrapper: {
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
            fontSize: `0.8rem`,
            fontWeight: 600,
            letterSpacing: -0.5,
        },
    }));

const roundNumber = (num: number) => Math.round((num / 10) * 10);

interface Score {
    name: string;
    achieved: number;
    notAchieved: number;
}
interface Data {
    learningOutcomeScores: Score;
    performanceScores: Score;
}

interface FilterItems {
    label: string;
    value: number;
}

interface StudentProps {
    student_id: string;
    student_name: string;
    avatar: string;
}
interface Props {
    data: Data[];
    width: number;
    height: number;
    viewScores: boolean;
    timeRange: string;
    filterItems: FilterItems[];
    selectedNodeId: string | undefined;
    selectedStudent: StudentProps | undefined;
    selectedGroup: GroupNameAll;
}
const margin = {
    top: 60,
    bottom: 60,
    left: 50,
    right: 50,
};
export default function SkillPerformance (props: Props) {
    const {
        data,
        width,
        height,
        viewScores,
    } = props;
    const intl = useIntl();
    const classes = useStyles();
    const theme = createTheme();
    const innerWidth = width - margin.left;
    const innerHeight = height - (margin.top + margin.bottom);
    const achievedColor = theme.palette.info.light;
    const notAchievedColor = theme.palette.error.light;
    const barRadius = 6;
    const keys = Object.keys(data[0].performanceScores || {})
        .filter((d) => d !== `name`);
    const scoreKeys = Object.keys(data[0] || {})
        .map((d) => d);
    const achievementTotals = data.reduce((totals, skill) => (
        totals.concat(skill.performanceScores.achieved + skill.performanceScores.notAchieved + skill.learningOutcomeScores.achieved + skill.learningOutcomeScores.notAchieved)
    ), [] as number[]);
    const maxScore = roundNumber(Math.max(...achievementTotals)) + 40;
    const axisLeftNumTick = 5;
    const others = intl.formatMessage({
        id: `home.student.learningOutcomeWidget.others`,
        defaultMessage: `Others`,
    });
    const getSkill = (d: any) => d.name ? d.name : others;
    const getGroupSkill = (d: Data) => d.performanceScores.name ? d.performanceScores.name : others;
    // Defining scales
    const xScale = scaleBand<string>({
        range: [ margin.left, innerWidth ],
        domain: data.map((d: Data) => getSkill(d.performanceScores)),
        paddingOuter: 3.8 / (data.length + 0.7),
        paddingInner: 0.7,
    });
    const x0Scale = scaleBand<string>({
        range: [ margin.left, innerWidth ],
        domain: scoreKeys,
        padding: 0.2,
    });
    const x1Scale = scaleBand<string>({
        domain: scoreKeys,
    });
    const yGroupScale = scaleLinear<number>({
        domain: [ 0, maxScore ],
    });
    const yScale = scaleLinear<number>({
        domain: [ 0, maxScore ],
        range: [ innerHeight, 0 ],
    });
    const colorRange = [ achievedColor, notAchievedColor ];
    const colorScale = scaleOrdinal({
        domain: data.map((d: any) => getSkill(d.performanceScores)),
        range: data.length % 2 === 0 ? colorRange : colorRange.reverse(),
    });
    const groupColorScale = scaleOrdinal({
        domain: scoreKeys,
        range: data.length % 2 === 0 ? colorRange : colorRange.reverse(),
    });
    x1Scale.rangeRound([ 0, x0Scale.bandwidth() ]);

    // Axis Tick Label Props
    const bottomTickLabelProps = () =>
        ({
            fontSize: `0.75rem`,
            letterSpacing: -0.5,
            fontWeight: 600,
            width: 80,
            dy: -10,
            textAnchor: `middle`,
            verticalAnchor: `start`,
            fill: `#9473E5`,
        } as const);
    const leftTickLabelProps = () =>
        ({
            fontSize: theme.typography.pxToRem(12),
            fontWeight: 400,
            fill: theme.palette.grey[500],
            dx: 7,
            dy: -5,
        } as const);

    const totalLabel = intl.formatMessage({
        id: `home.student.learningOutcomeWidget.totalLabel`,
    });

    return (
        <Box
            position="relative"
            paddingTop={theme.spacing(3)}
        >
            <svg
                width="100%"
                height={340}
            >
                {/* Chart Grid Lines */}
                <GridRows
                    scale={yScale}
                    left={margin.left}
                    width={innerWidth - margin.left}
                    height={innerHeight}
                    fill={theme.palette.grey[300]}
                    numTicks={axisLeftNumTick}
                    strokeDasharray="3"
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
                    <AxisLeft
                        hideTicks
                        hideAxisLine
                        left={margin.left}
                        scale={yScale}
                        tickLabelProps={leftTickLabelProps}
                        numTicks={axisLeftNumTick}
                    />
                </Group>
                {/* Axis Left */}
                {/* Chart Bars */}
                <Group>
                    <BarGroup
                        data={data}
                        keys={scoreKeys}
                        height={height}
                        x0={getGroupSkill}
                        x0Scale={x0Scale}
                        x1Scale={x1Scale}
                        yScale={yGroupScale}
                        color={groupColorScale}
                    >
                        {(barGroups) =>
                            barGroups.map((barGroup) => {
                                return (
                                    <Group
                                        key={`bar-group-${barGroup.index}-${barGroup.x0}`}
                                    >
                                        {barGroup.bars.map(({ value, key }, index) => {
                                            return (
                                                <BarStack
                                                    key={`bar-group-stack-${index}-${barGroup.x0}`}
                                                    data={[ value ]}
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
                                                                    <Group
                                                                        key={`bar-stack-${barStack.index}-${index}`}
                                                                        style={{
                                                                            display: key === `learningOutcomeScores` ? viewScores ? `initial` : `none` : `initial`,
                                                                        }}
                                                                    >
                                                                        <BarRounded
                                                                            height={height}
                                                                            radius={barRadius}
                                                                            width={key === `performanceScores` ? width : (width / 4)}
                                                                            x={!viewScores ? x : key === `performanceScores` ? x - (width / 2) : x + width}
                                                                            y={y}
                                                                            fill={key === `performanceScores` ? color : lighten(color, 0.8)}
                                                                            all={key !== `performanceScores`}
                                                                            top={
                                                                                barStack.key === `notAchieved` ||
                                                                                !bar?.data?.notAchieved
                                                                            }
                                                                        />
                                                                        <HtmlLabel
                                                                            horizontalAnchor="start"
                                                                            verticalAnchor="start"
                                                                            anchorLineStroke="none"
                                                                            x={!viewScores ? x : key === `performanceScores` ? x - (width / 2) : x + width}
                                                                            y={
                                                                                barStack.key === `notAchieved` ? y - 50 : y
                                                                            }
                                                                        >
                                                                            {color === notAchievedColor ? (
                                                                                <Box
                                                                                    style={{
                                                                                        width: width,
                                                                                        placeContent: key === `performanceScores` ? `end` : `start`,
                                                                                    }}
                                                                                    className={classes.totalLabelCont}
                                                                                >
                                                                                    <Box
                                                                                        className={classes.totalLabelWrapper}
                                                                                        style={{
                                                                                            background: key === `performanceScores` ? `#9473E5` : lighten(theme.palette.secondary.light, 0.2),
                                                                                            borderRadius: key === `performanceScores` ? `18px 18px 6px 18px` : `18px 18px 18px 6px`,
                                                                                        }}
                                                                                    >
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
                                                                                </Box>
                                                                            ) : (
                                                                                <Box
                                                                                    sx={{
                                                                                        width: width,
                                                                                    }}
                                                                                    className={classes.htmlLabelTextWrapperForBarValue}
                                                                                >
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        color={key === `performanceScores` ? theme.palette.common.white : theme.palette.info.light}
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
                                            );
                                        })}
                                    </Group>
                                );
                            })
                        }
                    </BarGroup>

                </Group>
                {/* Chart Bars */}
            </svg>
        </Box>
    );
}
