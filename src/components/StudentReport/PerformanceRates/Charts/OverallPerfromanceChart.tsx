
import {
    Avatar,
    Box,
    Chip,
    Icon,
    lighten,
    Typography,
} from "@mui/material";
import { HtmlLabel } from "@visx/annotation";
import {
    createTheme,
    Theme,
} from "@mui/material/styles";
import Emoji from "./Markers/Emoji";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { Glyph as CustomGlyph } from '@visx/glyph';
import { scaleLinear } from "@visx/scale";
import {
    AnnotationLabel,
    EventHandlerParams,
    LineSeries,
    XYChart,
    Axis,
    Tooltip,
    Grid,
    GlyphSeries,
    Annotation
} from "@visx/xychart";
import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { Group } from "@visx/group";
import { Line } from "@visx/shape";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        annotation: {
            borderRadius: 10,
        },
        tooltipContainer: {
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
            justifyContent: `center`,
            position: `relative`
        },
        tooltipArrow: {
            position: `absolute`,
            bottom: -22,
            fontSize: theme.typography.pxToRem(40),
        },
    }));

interface PerformaceResults {
    date: string;
    value: number;
}

interface DataProps {
    date: string,
    above?: number,
    meets?: number,
    below?: number,
    score: {
        above?: number,
        meets?: number,
        below?: number,
    },
}

interface Props {
    viewScores: boolean;
    width: number;
    height: number;
    data: DataProps[];
    timeRange: string;
    filterItems: any[];
    selectedNodeId: string | undefined;
}

const margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 70
}

export default function OverallPerformanceChart(props: Props) {

    const { viewScores, filterItems, timeRange, width, height, data, selectedNodeId } = props;
    const [tooltipColor, setTooltipColor] = useState<string | undefined>(``);
    const [tooltipTop, setTooltipTop] = useState(0);
    const [avatarPosition, setAvatarPosition] = useState({ x: 0, y: 0 });
    const classes = useStyles();
    const theme = createTheme();
    const intl = useIntl();
    const innerHeight = 370 - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const keys = useMemo(() => Object.keys(data[0]).filter(key => key !== `date` && key !== `score`), [data]);
    const overAllScores = keys.map(key => data.map(data => ({ date: data.date, value: data[key as keyof typeof data] })));
    const learningOutcomeScores = keys.map(key => data.map(data => ({ date: data.date, value: data.score[key as keyof typeof data.score] })));
    const glyphData = overAllScores.map(set => set[set.length - 1]);
    const totalScores = data.reduce((prev, current) => [
        ...prev,
        ...keys.map(key => current[key as keyof typeof current] as number)
    ], [] as number[]);

    const getDate = (d: PerformaceResults) => new Date(`${d.date}T00:00:00`);
    const getValue = (d: PerformaceResults) => d.value;
    const dateScaleConfig = {
        type: `band`,
    } as const;
    const valueScaleConfig = {
        type: `linear`,
    } as const;
    const yScale = useMemo(
        () =>
            scaleLinear<number>({
                range: [innerHeight, 0],
                domain: [0, Math.max(...totalScores)],
            }),
        [data]
    );
    const colorScale = {
        above: theme.palette.info.light,
        meets: theme.palette.success.light,
        below: lighten(theme.palette.warning.light, 0.2),
    }

    const handleMouseOver = ({ datum, key }: EventHandlerParams<any>) => {
        setTooltipTop(yScale(datum?.value));
        setTooltipColor(colorScale[key.split(`-`)[1] as keyof typeof colorScale]);
    };
    const handleHideTooltip = () => {
        setTooltipColor(undefined);
    }
    const getStrokeColor = (key: string) => {
        return tooltipColor ?
            colorScale[key as keyof typeof colorScale] === tooltipColor ? tooltipColor :
                theme.palette.grey[400] :
            colorScale[key as keyof typeof colorScale];
    }

    return (
        <XYChart
            xScale={dateScaleConfig}
            yScale={valueScaleConfig}
            height={400}
            width={width}
            margin={margin}
            onPointerMove={handleMouseOver}
            onPointerOut={handleHideTooltip}
        >
            {keys.map((key, i) => (
                <Group key={`records${key}`}>
                    <LineSeries
                        dataKey={`records-${key}`}
                        data={overAllScores[i]}
                        xAccessor={getDate}
                        yAccessor={getValue}
                        stroke={getStrokeColor(key)}
                    />
                </Group>
            ))}
            {viewScores && keys.map((key, i) => (
                <Group key={`scores${key}`}>
                    <LineSeries
                        dataKey={`scores-${key}`}
                        data={learningOutcomeScores[i]}
                        xAccessor={getDate}
                        yAccessor={getValue}
                        stroke={getStrokeColor(key)}
                        strokeDasharray={5}
                    />
                </Group>
            ))}
            <Tooltip
                showVerticalCrosshair
                snapTooltipToDatumX
                snapTooltipToDatumY
                showDatumGlyph
                verticalCrosshairStyle={{
                    strokeDasharray: 3,
                    stroke: tooltipColor,
                    y1: tooltipTop,
                    y2: innerHeight + margin.top,
                    pointerEvents: "none"
                }}
                offsetTop={-(margin.top * 1.3)}
                offsetLeft={-(margin.left * 0.8)}
                renderGlyph={(glyph) => <circle
                    r={5}
                    fill={tooltipColor ? theme.palette.common.white : `none`}
                    stroke={tooltipColor}
                    strokeWidth={3}
                    pointerEvents="none"
                />
                }
                unstyled
                applyPositionStyle
                renderTooltip={({ tooltipData, tooltipOpen }: any) => {
                    return tooltipOpen && tooltipData && <div className={classes.tooltipContainer} style={{
                        backgroundColor: tooltipColor,
                        width: 80,
                        height: 50,
                        borderRadius: theme.spacing(2.5),
                        pointerEvents: "none"
                    }}>
                        <Typography color={tooltipColor ? theme.palette.common.white : `transparent`} lineHeight={1} fontSize={20}>{tooltipData?.nearestDatum?.datum?.value}%</Typography>
                        <Typography color={tooltipColor ? theme.palette.common.white : `transparent`} lineHeight={1} fontSize={15} fontWeight={200}>
                            {intl.formatDate(tooltipData?.nearestDatum?.datum?.date, timeRange === filterItems[0] ? {
                                weekday: `short`,
                            } : timeRange === filterItems[1] ? {
                                day: `2-digit`,
                                month: `2-digit`,
                            } : {
                                month: `short`,
                                year: `2-digit`,
                            })}
                        </Typography>
                        <ArrowDropDownIcon className={classes.tooltipArrow} sx={{ color: tooltipColor ?? `transparent` }} />
                    </div>
                }}
            />
            <Grid
                columns={false}
                left={margin.left}
                children={((props: {
                    lines: any;
                }) => props.lines.map((line: any, i: number) => !!i && <Line key={i} stroke={theme.palette.grey[400]} strokeLinecap={`round`} strokeWidth={1}
                    strokeDasharray={3} from={line.from} to={line.to} />))}
                numTicks={5}
            />
            <AnnotationLabel
                width={innerWidth + 10}
                x={margin.left - 10}
                y={385}
                showBackground
                showAnchorLine={false}
                backgroundFill={theme.palette.grey[200]}
                title="Bottom label"
                verticalAnchor="end"
                horizontalAnchor="start"
                titleProps={{
                    visibility: 'hidden',
                }}
                backgroundProps={{
                    rx: 20,
                }}
            />
            <Axis
                hideTicks
                hideAxisLine
                orientation="bottom"
                top={innerHeight + margin.top}
                tickLabelProps={() => ({
                    dy: theme.spacing(7),
                    fontWeight: theme.typography.fontWeightRegular,
                    textAnchor: `middle`,
                    fontSize: theme.typography.pxToRem(14),
                    fill: theme.palette.common.black
                })}
                tickFormat={(day) => {
                    return intl.formatDate(day, timeRange === filterItems[0] ? {
                        weekday: `short`,
                    } : timeRange === filterItems[1] ? {
                        day: `2-digit`,
                        month: `2-digit`,
                    } : {
                        month: `short`,
                        year: `2-digit`,
                    });
                }}
            />
            <Axis
                hideTicks
                hideAxisLine
                left={margin.left}
                orientation="left"
                numTicks={5}
                tickLabelProps={() => ({
                    dx: 5,
                    dy: -10,
                    fill: theme.palette.grey[600],
                    textAnchor: `start`,
                })}
                tickFormat={(number) => {
                    return `${number}%`;
                }}
            />
            {keys.map((key, i) => (
                <Group key={`records-glyph-${key}`}>
                    <GlyphSeries
                        enableEvents={false}
                        data={[glyphData[i]]}
                        dataKey={`records-glyph-${key}`}
                        xAccessor={getDate}
                        yAccessor={getValue}
                        renderGlyph={(glyph) => (
                            selectedNodeId && (keys.indexOf(selectedNodeId) < 0) ?
                                <HtmlLabel
                                    x={glyph.x}
                                    y={glyph.y}
                                    anchorLineStroke="none"
                                    horizontalAnchor="middle"
                                    verticalAnchor="middle"
                                >
                                    <Avatar 
                                        src="../" 
                                        sx={{ 
                                            width: 30, 
                                            height: 30, 
                                            bgcolor : getStrokeColor(key), 
                                            border: `2px solid ${theme.palette.common.white}`, 
                                        }}>
                                        <Typography fontSize={14}>
                                            {selectedNodeId}
                                        </Typography>
                                    </Avatar>
                                </HtmlLabel> :
                                <CustomGlyph top={glyph.y - 15} left={glyph.x - 10}>
                                    <Emoji id={key} color={getStrokeColor(key)} />
                                </CustomGlyph>
                        )}
                    />
                </Group>
            ))}
        </XYChart>
    );
}