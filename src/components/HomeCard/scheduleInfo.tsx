import globalStyles from "@/globalStyles";
import {
    EventClassType,
    SchedulePayload,
} from "@/types/objectTypes";
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import React from "react";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import {
    FormattedDate,
    FormattedMessage,
    FormattedTime,
} from "react-intl";
import FormattedDuration from "react-intl-formatted-duration";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => {
    const { fontWeightBold } = globalStyles(theme);

    return createStyles({
        fontWeightBold,
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
        cardBodyInner: {
            padding: theme.spacing(2, 4),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(2, 2),
            },
            [theme.breakpoints.up(`md`)]: {
                maxHeight: 660,
                overflowY: `auto`,
            },
        },
        cardButton: {
            background: `transparent`,
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
        },
        classItemLive: {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
        },
        classTypeChip: {
            padding: `2px 6px`,
            borderRadius: 20,
            color: theme.palette.primary.main,
            backgroundColor: `transparent`,
            border: `2px solid ${theme.palette.primary.main}`,
            fontWeight: `bold`,
            marginRight: theme.spacing(2),
            fontSize: `0.9em`,
        },
        classTypeChipLive: {
            color: `white`,
            backgroundColor: theme.palette.primary.main,
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
        duration: {
            fontWeight: `bold`,
            fontSize: `1em`,
        },
    });

});

const classTypeTranslationKey = (type: EventClassType) => {
    switch (type) {
    case `Homework`:
        return `scheduleInfo_study`;
    case `Task`:
        return `scheduleInfo_task`;
    case `OnlineClass`:
        return `scheduleInfo_live`;
    case `OfflineClass`:
        return `scheduleInfo_class`;
    }
};

interface Props {
    schedule?: SchedulePayload[];
    scrollCallback: () => void;
    loading: boolean;
}

export default function ScheduleInfoShort (props: Props) {
    const {
        schedule,
        scrollCallback,
        loading,
    } = props;
    const classes = useStyles();
    const navigate = useNavigate();
    const yesterday = new Date()
        .setDate(new Date()
            .getDate() - 1) / 1000;
    const now = new Date();
    const timeZoneOffset = now.getTimezoneOffset() * 60000;
    const SCHEDULE_PAGINATION_DELAY = 1000;
    const scrollRef = useBottomScrollListener<HTMLDivElement>(scrollCallback, {
        offset: window.innerHeight / 2, // detect scrolling with an offset of half of the screen height from the bottom
        debounce: SCHEDULE_PAGINATION_DELAY,
    });
    const scheduledClass = schedule
        ?.map((e) => ({
            ...e,
            start_at_date: new Date((e.start_at * 1000) - timeZoneOffset)
                .toISOString()
                .split(`T`)[0],
        }))
        .filter((event) => event.status !== `Closed`)
        .filter((event) => event.start_at > yesterday);

    const daysWithClass = schedule
        ?.map((e) => ({
            ...e,
            start_at_date: new Date((e.start_at * 1000) - timeZoneOffset)
                .toISOString()
                .split(`T`)[0],
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
                justifyContent="space-between"
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
                        color="primary"
                        variant="contained"
                        className={classes.cardButton}
                        onClick={(e: React.MouseEvent) => {
                            navigate(`/schedule`);
                            e.preventDefault();
                        }}
                    >
                        <FormattedMessage id="scheduleInfo_seeScheduleLabel" />
                    </Button>
                </Grid>
            </Grid>
            <Grid
                container
                justifyContent="space-between"
            >
                <Grid
                    ref={scrollRef}
                    item
                    xs
                    className={classes.cardBodyInner}
                >
                    {scheduledClass && scheduledClass.length !== 0 ? (
                        <>
                            {daysWithClass?.map((dayWithClass) => (
                                <Box
                                    key={dayWithClass}
                                    className={classes.dayGroup}
                                >
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
                                                return (
                                                    <Grid
                                                        key={`${dayWithClass}:${item.id}`}
                                                        container
                                                        className={clsx(classes.classItem, {
                                                            [classes.classItemLive]: item.class_type === `OnlineClass`,
                                                        })}
                                                        alignItems="center"
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid item>
                                                            <Grid
                                                                container
                                                                alignItems="center"
                                                            >
                                                                <div
                                                                    className={clsx(classes.classTypeChip, {
                                                                        [classes.classTypeChipLive]: item.class_type === `OnlineClass`,
                                                                    })}
                                                                >
                                                                    <FormattedMessage id={classTypeTranslationKey(item.class_type)} />
                                                                </div>
                                                                <div className={classes.fontWeightBold}>
                                                                    {item.title}
                                                                </div>
                                                            </Grid>
                                                        </Grid>

                                                        <Grid
                                                            item
                                                            style={{
                                                                textAlign: `right`,
                                                            }}
                                                        >
                                                            <FormattedTime
                                                                value={item.start_at * 1000}
                                                                hour="2-digit"
                                                                minute="2-digit"
                                                            />
                                                            <Typography
                                                                variant="body2"
                                                                className={classes.duration}
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
                            {loading && (
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <CircularProgress />
                                </Box>
                            )}
                        </>
                    ) : (
                        <Typography
                            gutterBottom
                            variant="body2"
                        >
                            <FormattedMessage id="scheduleInfo_noClasses" />
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
}
