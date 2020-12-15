
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { Divider, Grid, Typography } from "@material-ui/core";
import { SchedulePayload } from "../../../types/objectTypes";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            "backgroundColor": "#fff",
            "color": "black",
            "&:hover": {
                color: "white",
            },
        },
        infoCard: {
            backgroundColor: "#f0f0f0",
            borderRadius: 12,
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)",
            marginRight: theme.spacing(4),
            marginBottom: theme.spacing(2),
            padding: theme.spacing(3),
            [theme.breakpoints.down("sm")]: {
                marginRight: theme.spacing(1),
                padding: theme.spacing(2),
            },
        },
        infoContainer: {
            borderRadius: 12,
            marginRight: theme.spacing(4),
            marginTop: theme.spacing(2),
            padding: theme.spacing(3),
            [theme.breakpoints.down("sm")]: {
                marginRight: theme.spacing(1),
                padding: theme.spacing(2),
            },
        },
    }),
);

export default function ScheduleInfo({ schedule }: { schedule?: SchedulePayload[] }) {
    const classes = useStyles();

    const onlineClass = schedule?.filter((event) => event.class_type === "OnlineClass");
    const onlineClassAttended = onlineClass?.filter((event) => event.status === "Closed");

    const offlineClass = schedule?.filter((event) => event.class_type === "OfflineClass");
    const offlineClassAttended = offlineClass?.filter((event) => event.status === "Closed");

    const study = schedule?.filter((event) => event.class_type === "Homework");
    const studyCompleted = study?.filter((event) => event.status === "Closed");

    return (
        <Grid
            container
            direction="row"
            justify="flex-start"
            className={classes.infoContainer}
        >
            <Grid item xs={6}>
                <Grid
                    item
                    className={classes.infoCard}
                >
                    <Typography variant="h4">
                        { onlineClass?.length }
                    </Typography>
                    <Typography variant="caption">
                        live classes scheduled
                    </Typography>
                    <Divider />
                    <Typography variant="body2">
                        { onlineClassAttended?.length } attended
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid
                    item
                    className={classes.infoCard}
                >
                    <Typography variant="h4">
                        { offlineClass?.length }
                    </Typography>
                    <Typography variant="caption">
                        offline classes scheduled
                    </Typography>
                    <Divider />
                    <Typography variant="body2">
                        { offlineClassAttended?.length } attended
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid
                    item
                    className={classes.infoCard}
                >
                    <Typography variant="h4">
                        { study?.length }
                    </Typography>
                    <Typography variant="caption">
                        homework assigned
                    </Typography>
                    <Divider />
                    <Typography variant="body2">
                        { studyCompleted?.length } completed
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
}
