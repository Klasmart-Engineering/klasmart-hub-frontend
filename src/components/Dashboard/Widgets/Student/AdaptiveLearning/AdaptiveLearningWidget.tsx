import ChartLegend from "./ChartLegend";
import GroupedBar from "./GroupedBar";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import {
    Box,
    createTheme,
    Grid,
    Theme,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import { ParentSize } from "@visx/responsive";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        widgetContent: {
            display: `flex`,
            height: `100%`,
            flexWrap: `wrap`,
            paddingTop: theme.spacing(.625),
            paddingBottom: theme.spacing(0),
            [theme.breakpoints.down(`sm`)]: {
                paddingTop:  theme.spacing(0.12),
                paddingBottom:  theme.spacing(.625),
            },
        },
        chartContainer: {
            height: `90%`,
            [theme.breakpoints.down(`sm`)]: {
                height: `75%`,
            },
        },
        labelContainer: {
            height: `90%`,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
            flexWrap: `wrap`,
            paddingTop:  theme.spacing(1.87),
            paddingBottom:  theme.spacing(1.25),
            [theme.breakpoints.down(`sm`)]: {
                height: `25%`,
                paddingBottom: theme.spacing(0),
                paddingTop: theme.spacing(0),
                flexWrap: `nowrap`,
            },
        },
        labelGrid: {
            height: `100%`,
            padding: theme.spacing(0.875, 0),
        },
        label: {
            height: theme.spacing(7),
            backgroundColor: theme.palette.grey[100],
            borderRadius: theme.spacing(1.25),
            margin: `0.2em`,
            [theme.breakpoints.down(`sm`)]: {
                margin: `0.2em`,
            },
        },
        labelName: {
            fontSize: `.8rem`,
            fontWeight: 600,
            lineHeight: theme.spacing(2),
            [theme.breakpoints.down(`sm`)]: {
                textAlign: `center`,
                width: `100%`,
                paddingTop: theme.spacing(.625),
                fontSize: `.7rem`,
            },
            [theme.breakpoints.down(`md`)]:{
                fontSize: `.6rem`,
            },
        },
        labelValue: {
            fontSize: `1.5rem`,
            paddingLeft:theme.spacing(.625),
            paddingRIght:theme.spacing(.625),
            color: theme.palette.info.light,
            [theme.breakpoints.down(`sm`)]: {
                textAlign: `center`,
                width: `100%`,
            },
            [theme.breakpoints.down(`md`)]: {
                fontSize: `1.2rem`,
            },
        },
        labelType: {
            fontSize: `.8rem`,
            color: theme.palette.info.light,
            [theme.breakpoints.down(`md`)]: {
                fontSize: `.6rem`,
            },
        },
        labelText: {
            display: `flex`,
            justifyContent:`center`,
        },
        labelTextWrapper: {
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `center`,
            alignItems: `center`,
            height: `100%`,
        },
    }));

interface LabelProps {
    dataName: string;
    value: number;
    type: string;
}

interface Props {
}

export default function AdaptiveLearningWidget (props: Props) {
    const intl = useIntl();
    const classes = useStyles();
    const theme = createTheme();
    const legendColorRange = [ theme.palette.info.light, theme.palette.grey[500] ];
    const chartColorRange = [ theme.palette.grey[500], theme.palette.info.light ];
    // TODO: Mock data
    const data = [
        {
            skill: intl.formatMessage({
                id: `home.student.adaptiveLearningWidget.skill1`,
            }),
            WithoutReview: 64,
            WithReview: 83,
        },
        {
            skill: intl.formatMessage({
                id: `home.student.adaptiveLearningWidget.skill2`,
            }),
            WithoutReview: 56,
            WithReview: 100,
        },
        {
            skill: intl.formatMessage({
                id: `home.student.adaptiveLearningWidget.skill3`,
            }),
            WithoutReview: 32,
            WithReview: 68,
        },
    ];

    const labelData = [
        {
            dataName: intl.formatMessage({
                id: `home.student.adaptiveLearningWidget.badaBoost`,
            }),
            value: 32,
            type: `%`,
        },
        {
            dataName: intl.formatMessage({
                id: `home.student.adaptiveLearningWidget.totalReviews`,
            }),
            value: 3,
            type: intl.formatMessage({
                id: `home.student.adaptiveLearningWidget.classes`,
            }),
        },
        {
            dataName: intl.formatMessage({
                id: `home.student.adaptiveLearningWidget.skillsImproved`,
            }),
            value: 6,
            type: intl.formatMessage({
                id: `home.student.adaptiveLearningWidget.skills`,
            }),
        },
    ];

    return (
        <WidgetWrapper
            loading={false}
            error={undefined}
            noData={false}
            reload={() => {
                return;
            }}
            label={intl.formatMessage({
                id: `home.student.adaptiveLearningWidget.containerTitleLabel`,
            })}
            link={{
                url: ``,
                label: intl.formatMessage({
                    id: `home.student.adaptiveLearningWidget.containerUrlLabel`,
                }),
            }}
            id={WidgetType.ADAPTIVELEARNING}
        >
            <Box className={classes.widgetContent}>
                <ChartLegend
                    colorRange={legendColorRange}
                />
                <Grid
                    item
                    xs={12}
                    sm={8}
                    className={classes.chartContainer}
                >
                    <ParentSize>
                        {({ width, height }) => (
                            <GroupedBar
                                width={width}
                                height={height}
                                data={data}
                                colorRange={chartColorRange}
                                windowWidth={width} />
                        )}
                    </ParentSize>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={4}
                    className={classes.labelContainer}
                >
                    {labelData.map((label: LabelProps) => (
                        <Grid
                            key={label.dataName}
                            item
                            xs={4}
                            sm={12}
                            className={classes.label}

                        >
                            <Box className={classes.labelTextWrapper}>
                                <Grid
                                    item
                                    xs={12}
                                    sm={5}
                                    className={classes.labelText}>
                                    <Typography
                                        variant="h1"
                                        className={classes.labelName}>
                                        {label.dataName}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={5}
                                    className={classes.labelText}>
                                    <Typography
                                        variant="h1"
                                        className={classes.labelValue}>
                                        {label.value}
                                        <span className={classes.labelType}>{label.type}</span>
                                    </Typography>
                                </Grid>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </WidgetWrapper>
    );
}
