
import { DailyCalendarEvent } from "./DailyCalenderHelper";
import {
    Box,
    createStyles,
    makeStyles,
    SvgIcon,
    Theme,
    Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({
    calendarLabel: {
        padding: theme.spacing(0, 1, .8, 1),
        color: `white`,
        border: `1px solid rgba(255, 255, 255, 0.25)`,
        borderRadius: 15,
        height: `100%`,
        width: `100%`,
    },
    icon: {
        fontSize: `1.25rem`,
    },
    title: {
        fontWeight: `bold`,
        paddingLeft: theme.spacing(.5),
        whiteSpace: `nowrap`,
        overflow: `hidden`,
        textOverflow: `ellipsis`,
    },
    subtitle: {
        lineHeight: `1em`,
        opacity: .8,
        fontSize: `.9em`,
        whiteSpace: `nowrap`,
        overflow: `hidden`,
        textOverflow: `ellipsis`,
    },
}));

type Props = {
    event: DailyCalendarEvent;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export default function DailyScheduleEvent (props: Props) {
    const classes = useStyles();

    const {
        event,
        onMouseEnter,
        onMouseLeave,
    } = props;

    return (
        <div
            className={clsx(`rbc-custom-label`, classes.calendarLabel)}
            style={{
                backgroundColor: event.backgroundColor ?? `blue`,
            }}
            tabIndex={0}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <Box
                display="flex"
                alignItems="center">
                { event.icon &&
                    (<SvgIcon
                        component={event.icon}
                        className={classes.icon} />)
                }
                <Typography className={classes.title}>{ event.title }</Typography>
            </Box>
            <Typography className={classes.subtitle}>{ event.subtitle }</Typography>
        </div>
    );
}
