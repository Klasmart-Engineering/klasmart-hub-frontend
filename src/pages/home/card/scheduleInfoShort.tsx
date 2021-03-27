import { SchedulePayload } from "@/types/objectTypes";
import { history } from "@/utils/history";
import {
    Box,
    Button,
    Grid,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import React from "react";
import {
    FormattedDate,
    FormattedMessage,
    FormattedTime,
} from "react-intl";
import FormattedDuration from "react-intl-formatted-duration";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardHead: {
            padding: theme.spacing(1, 4),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(1, 2),
            },
            borderBottom: `1px solid ${theme.palette.grey[300]}`,
        },
        cardTitle: {
            textTransform: `uppercase`,
            fontWeight: `bold`,
        },
        cardBody: {
            padding: theme.spacing(2, 4),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(2, 2),
            },
        },
        cardBodyInner: {
            [theme.breakpoints.up(`md`)]: {
                maxHeight: 660,
                overflowY: `auto`,
            },
        },
        cardButton: {
            background: `transparent`,
            color: theme.palette.primary.main,
            boxShadow: `none`,
            "&:hover, &:active": {
                backgroundColor: theme.palette.grey[100],
                boxShadow: `none`,
            },
        },
        classItem: {
            padding: theme.spacing(1, 2),
            marginBottom: theme.spacing(1),
            borderRadius: 8,
            fontSize: `0.9em`,
            backgroundColor: `transparent`,
            border: `3px solid ${theme.palette.primary.light}`,
            color: theme.palette.primary.main,
            "& .classLabel": {
                color: theme.palette.primary.main,
                backgroundColor: `transparent`,
            },
        },
        classItemTask: {},
        classItemLive: {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
            "& .classLabel": {
                color: `white`,
                backgroundColor: theme.palette.primary.main,
            },
        },
        classItemStudy: {},
        classLabel: {
            padding: `2px 6px`,
            borderRadius: 20,
            color: `#fff`,
            backgroundColor: `transparent`,
            border: `2px solid ${theme.palette.primary.main}`,
            fontWeight: `bold`,
            marginRight: theme.spacing(2),
            fontSize: `0.9em`,
        },
        dayGroup: {
            marginTop: 20,
            "&:first-of-type": {
                marginTop: 0,
            },
        },
        dayGroupTitle: {
            color: theme.palette.grey[500],
            textTransform: `uppercase`,
            marginBottom: 5,
            fontSize: `0.9em`,
            fontWeight: `bold`,
        },
    }));

export default function ScheduleInfoShort ({ schedule }: {
    schedule?: SchedulePayload[];
}) {
    const classes = useStyles();
    const yesterday = new Date().setDate(new Date().getDate() - 1) / 1000;
    const now = new Date();
    const timeZoneOffset = now.getTimezoneOffset() * 60000;

    const scheduledClass = schedule
        ?.map((e) => ({
            ...e,
            start_at_date: new Date((e.start_at * 1000) - timeZoneOffset).toISOString().split(`T`)[0],
        }))
        .filter((event) => event.status !== `Closed`)
        .filter((event) => event.start_at > yesterday);

    const daysWithClass = schedule
        ?.map((e) => ({
            ...e,
            start_at_date: new Date((e.start_at * 1000) - timeZoneOffset).toISOString().split(`T`)[0],
        }))
        .filter((event) => event.status !== `Closed`)
        .filter((event) => event.start_at > yesterday)
        .reduce((global: string[], current) => {
            return global.includes(current.start_at_date)
                ? global
                : global.concat(current.start_at_date);
        }, []);

    return (
        <Grid container>
            <Grid
                container
                justify="space-between"
                alignItems="center"
                className={classes.cardHead}
            >
                <Grid item>
                    <Typography className={classes.cardTitle}>
                        <FormattedMessage id="scheduleInfo_title" />
                    </Typography>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        className={classes.cardButton}
                        onClick={(e: React.MouseEvent) => {
                            history.push(`/schedule`);
                            e.preventDefault();
                        }}
                    >
                        <FormattedMessage id="scheduleInfo_seeScheduleLabel" />
                    </Button>
                </Grid>
            </Grid>
            <Grid
                container
                justify="space-between"
                className={classes.cardBody}>
                <Grid
                    item
                    xs
                    className={classes.cardBodyInner}>
                    {scheduledClass && scheduledClass.length !== 0 ? (
                        <>
                            {daysWithClass?.map((dayWithClass) => (
                                <Box
                                    key={dayWithClass}
                                    className={classes.dayGroup}>
                                    <Typography className={classes.dayGroupTitle}>
                                        <FormattedDate
                                            value={dayWithClass}
                                            month="long"
                                            day="numeric"
                                            weekday="long"
                                        />
                                    </Typography>
                                    <Box>
                                        {scheduledClass
                                            .filter((classItem) => classItem.start_at_date === dayWithClass)
                                            .map((item) => {
                                                let classLabel = `class`;
                                                let classClass = ``;

                                                switch (item.class_type) {
                                                case `Task`:
                                                    classLabel = `scheduleInfo_task`;
                                                    classClass = classes.classItemTask;
                                                    break;
                                                case `OnlineClass`:
                                                    classLabel = `scheduleInfo_live`;
                                                    classClass = classes.classItemLive;
                                                    break;
                                                case `OfflineClass`:
                                                    classLabel = `scheduleInfo_study`;
                                                    classClass = classes.classItemStudy;
                                                    break;
                                                default:
                                                    break;
                                                }

                                                return (
                                                    <Grid
                                                        key={item.id}
                                                        container
                                                        className={`${classes.classItem} ${classClass}`}
                                                        alignItems="center"
                                                        justify="space-between"
                                                    >
                                                        <Grid item>
                                                            <Grid
                                                                container
                                                                alignItems="center">
                                                                <div
                                                                    className={`classLabel ${classes.classLabel}`}
                                                                >
                                                                    <FormattedMessage id={classLabel} />
                                                                </div>
                                                                <div style={{
                                                                    fontWeight: `bold`,
                                                                }}>
                                                                    {item.title}
                                                                </div>
                                                            </Grid>
                                                        </Grid>

                                                        <Grid
                                                            item
                                                            style={{
                                                                textAlign: `right`,
                                                            }}>
                                                            <FormattedTime
                                                                value={item.start_at * 1000}
                                                                hour="2-digit"
                                                                minute="2-digit"
                                                            />
                                                            <Typography
                                                                style={{
                                                                    fontSize: `1em`,
                                                                    fontWeight: `bold`,
                                                                }}
                                                            >
                                                                <FormattedDuration
                                                                    seconds={item?.end_at - item?.start_at}
                                                                    format="{hours} {minutes}"
                                                                />
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                );
                                            })}
                                    </Box>
                                </Box>
                            ))}
                        </>
                    ) : (
                        <Typography
                            gutterBottom
                            variant="body2">
                            <FormattedMessage id="scheduleInfo_noClasses" />
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
}
