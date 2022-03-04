import {
    Box,
    Typography,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
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

interface Props {
    colorRange: string[];
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        legendWrapper: {
            width: `100%`,
            height: 14,
            display: `flex`,
            justifyContent: `space-between`,
            alignItems: `center`,
        },
        legendItemWrapper: {
            display: `flex`,
            height: 14,
            [theme.breakpoints.down(`sm`)]: {
                display: `none`,
            },
        },
        legendLabelText: {
            fontWeight: 400,
            margin: 0,
            fontSize: `.7rem`,
            color: theme.palette.grey[500],
        },
        legendTitle: {
            fontSize: `.9rem`,
        },
    }));

export default function ChartLegend (props: Props){
    const { colorRange } = props;
    const intl = useIntl();
    const classes = useStyles();
    const legendShapeWidth = 10;
    const legendShapeHeight = 10;
    const withReview = intl.formatMessage({
        id: `home.student.adaptiveLearningWidget.legendWithReview`,
    });
    const withoutReview = intl.formatMessage({
        id: `home.student.adaptiveLearningWidget.legendWithoutReview`,
    });
    const legendTitle = intl.formatMessage({
        id: `home.student.adaptiveLearningWidget.legendTitle`,
    });
    const ordinalColorScale = scaleOrdinal({
        domain: [ withReview, withoutReview ],
        range: colorRange,
    });
    return (
        <Box
            className={classes.legendWrapper}>
            <Typography
                variant="subtitle2"
                className={classes.legendTitle}>
                {legendTitle}
            </Typography>
            <LegendOrdinal
                scale={ordinalColorScale}
                labelFormat={(label) => label} >
                {(labels) => (
                    <Box
                        className={classes.legendItemWrapper}
                    >
                        {labels.map((label, i) => (
                            <LegendItem
                                key={`legend-quantile-${i}`}
                                margin="0 5px">
                                <svg
                                    width={legendShapeWidth}
                                    height={legendShapeHeight}>
                                    <rect
                                        fill={label.value}
                                        width={legendShapeWidth}
                                        height={legendShapeHeight}
                                        rx={2}
                                    />
                                </svg>
                                <LegendLabel
                                    align="left"
                                    margin="0 0 0 5px">
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
