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
        legendItemWrapper: {
            display: `flex`,
            alignItems: `center`,
            marginLeft: theme.spacing(6),
        },
        legendLabelText: {
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: theme.typography.pxToRem(12),
            color: theme.palette.grey[500],
        },
        legendTitle: {
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: theme.typography.pxToRem(12),
            color: theme.palette.grey[500],
        },
    }));

interface Props {}

export default function OverallPerformanceLegend (props: Props) {
    const intl = useIntl();
    const classes = useStyles();
    const theme = createTheme();
    const legendShapeWidth = 10;
    const legendShapeHeight = 10;
    const legendTitle = intl.formatMessage({
        id: `student.report.performanceRates.overallLegendTitle`,
        defaultMessage: `Scores`,
    });
    const legendSubTitle = intl.formatMessage({
        id: `student.report.performanceRates.overallLegendSubtitle`,
        defaultMessage: `Learning Outcomes`,
    });
    const above = intl.formatMessage({
        id: `student.report.performanceRates.overallLegendAbove`,
        defaultMessage: `Above`,
    });
    const meets = intl.formatMessage({
        id: `student.report.performanceRates.overallLegendMeets`,
        defaultMessage: `Meets`,
    });
    const below = intl.formatMessage({
        id: `student.report.performanceRates.overallLegendBelow`,
        defaultMessage: `Below`,
    });
    const ordinalColorScale = scaleOrdinal({
        domain: [
            above,
            meets,
            below,
        ],
        range: [
            theme.palette.info.light,
            theme.palette.success.light,
            lighten(theme.palette.warning.light, 0.2),
        ],
    });
    return (
        <Box paddingBottom={theme.spacing(2)}>
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
                                        className={classes.legendLabelText}
                                    >
                                        {label.text}
                                    </Typography>
                                </LegendLabel>
                            </LegendItem>
                        ))}
                        <Typography
                            variant="subtitle2"
                            className={classes.legendTitle}
                        >
                            {`—  ${legendTitle}  --  ${legendSubTitle}`}
                        </Typography>
                    </Box>
                )}
            </LegendOrdinal>
        </Box>
    );
}
