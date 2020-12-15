
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { useQuery, useReactiveVar } from "@apollo/client/react";
import { Button, Grid, Typography } from "@material-ui/core";
import { useRestAPI } from "../../../api/restapi";
import { userIdVar } from "../../../cache";
import { User } from "../../../models/Membership";
import { GET_USER } from "../../../operations/queries/getUser";
import AssessmentInfo from "./assessmentInfo";
import ScheduleInfo from "./scheduleInfo";

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
            borderRadius: 12,
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(2, 2),
            },
        },
        paperContainer: {
            borderRadius: 12,
            boxShadow: theme.palette.type === "dark" ? "0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)" : "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
        },
    }),
);

export default function SummaryCard() {
    const classes = useStyles();
    const restApi = useRestAPI();

    const user_id = useReactiveVar(userIdVar);
    const { data, loading, error } = useQuery(GET_USER, {
        fetchPolicy: "network-only",
        variables: {
            user_id,
        },
    });
    const user: User = data?.user;

    return (
        <Paper elevation={4} className={classes.paperContainer}>
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="stretch"
                className={classes.infoContainer}
            >
                <Grid item>
                    <Typography variant="h4">
                        👋 Hello, { user?.given_name }
                    </Typography>
                </Grid>
                <Grid item>
                    <AssessmentInfo />
                </Grid>
            </Grid>
        </Paper>
    );
}
