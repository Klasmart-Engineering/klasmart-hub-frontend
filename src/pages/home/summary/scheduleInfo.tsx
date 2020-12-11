
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { useQuery, useReactiveVar } from "@apollo/client/react";
import { Divider, Grid, Typography } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { useRestAPI } from "../../../api/restapi";
import { currentMembershipVar, userIdVar } from "../../../cache";
import { User } from "../../../models/Membership";
import { GET_USER } from "../../../operations/queries/getUser";
import { SchedulePayload } from "../../../types/objectTypes";
import { schedulePayload } from "./payload";

const payload = schedulePayload;

const now = new Date();
const todayTimeStamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
const timeZoneOffset = now.getTimezoneOffset() * 60 * -1; // to make seconds

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            "backgroundColor": "#fff",
            "color": "black",
            "&:hover": {
                color: "white",
            },
        },
        infoContainer: {
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
    }),
);

export default function ScheduleInfo() {
    const classes = useStyles();
    const restApi = useRestAPI();

    const [schedule, setSchedule] = useState<SchedulePayload[] | undefined>(undefined);

    const currentOrganization = useReactiveVar(currentMembershipVar);

    async function getScheduleList() {
        try {
            const response = await restApi.schedule(currentOrganization.organization_id, "month", todayTimeStamp, timeZoneOffset);
            setSchedule(response);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (currentOrganization.organization_id !== "") {
            getScheduleList();
        }
    }, [currentOrganization]);

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
        >
            <Grid item xs={6}>
                <Grid
                    item
                    className={classes.infoContainer}
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
                    className={classes.infoContainer}
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
                    className={classes.infoContainer}
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
