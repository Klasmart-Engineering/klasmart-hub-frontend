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
import {
    LegendItem,
    LegendLabel,
    LegendOrdinal,
} from "@visx/legend";
import { scaleOrdinal } from "@visx/scale";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        legendWrapper: {
            height: 14,
            display: `flex`,
            justifyContent: `space-between`,
            alignItems: `center`,
            marginBottom: theme.spacing(2),
        },
        legendItemWrapper: {
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
            height: 14,
        },
        legendLabelText: {
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: theme.typography.pxToRem(12),
            color: theme.palette.grey[500],
        },
        legendTitle: {
            fontSize: theme.typography.pxToRem(14),
        },
    }));

interface Props {
    height: number;
}

export default function ChartLegend (props: Props) {
    const intl = useIntl();
    const classes = useStyles();
    const theme = createTheme();
    const { height } = props;
    const legendShapeWidth = 10;
    const legendShapeHeight = 10;
    const domain = [
        intl.formatMessage({
            id: `student.report.performanceRates.skillLegendAttained`,
        }),
        intl.formatMessage({
            id: `student.report.performanceRates.skillLegendNotAttained`,
        }),
        intl.formatMessage({
            id: `student.report.performanceRates.skillLegendLOsAttained`,
        }),
        intl.formatMessage({
            id: `student.report.performanceRates.skillLegendLOsNotAttained`,
        }),
    ];
    const colorRange = [
        theme.palette.info.light,
        theme.palette.error.light,
        lighten(theme.palette.info.light, 0.8),
        lighten(theme.palette.error.light, 0.8),
    ];
    const ordinalColorScale = scaleOrdinal({
        domain: domain,
        range: colorRange,
    });
    return (
        <Box
            sx={{
                height,
            }}
            className={classes.legendWrapper}
        >
            <LegendOrdinal
                scale={ordinalColorScale}
                labelFormat={(label) => label}
            >
                {(labels) => (
                    <Box className={classes.legendItemWrapper}>
                        {labels.map((label, i) => (
                            <LegendItem
                                key={`legend-quantile-${i}`}
                                margin="0 5px"
                            >
                                <svg
                                    width={legendShapeWidth}
                                    height={legendShapeHeight}
                                >
                                    <rect
                                        fill={label.value}
                                        width={legendShapeWidth}
                                        height={legendShapeHeight}
                                        rx={2}
                                    />
                                </svg>
                                <LegendLabel
                                    align="left"
                                    margin="0 0 0 5px"
                                >
                                    <Typography
                                        variant="subtitle2"
                                        color="grey"
                                        className={classes.legendLabelText}
                                    >
                                        {label.text}
                                    </Typography>
                                </LegendLabel>
                            </LegendItem>
                        ))}
                    </Box>
                )}
            </LegendOrdinal>
        </Box>
    );
}
