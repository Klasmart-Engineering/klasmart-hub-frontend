import { useReactiveVar } from "@apollo/client/react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useEffect, useState } from "react";

import { useRestAPI } from "../../api/restapi";
import { currentMembershipVar } from "../../cache";
import { SchedulePayload } from "../../types/objectTypes";
import GreetingCard from "./card/greetingCard";
import PlanSelection from "./card/planSelection";
import ScheduleInfo from "./card/scheduleInfo";
import ContentLayout from "./featuredContent/contentLayout";

const now = new Date();
const todayTimeStamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
const timeZoneOffset = now.getTimezoneOffset() * 60 * -1; // to make seconds

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paperContainer: {
            borderRadius: 12,
            boxShadow: theme.palette.type === "dark" ? "0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)" : "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
            height: "100%",
        },
        root: {
            backgroundColor: "#eef7fd",
            height: "100%",
            paddingBottom: theme.spacing(2),
            paddingTop: theme.spacing(2),
        },
    }),
);

function Card({children}: {children: React.ReactNode}) {
    const classes = useStyles();

    return (
        <Paper elevation={4} className={classes.paperContainer}>
            { children }
        </Paper>
    );
}

export default function Home() {
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

    return (
        <Container
            maxWidth={"xl"}
            className={classes.root}
        >
            <Grid
                container
                alignContent="stretch"
                spacing={2}
            >
                <Grid item xs={12} md={4}>
                    <Card>
                        <PlanSelection schedule={schedule} />
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Grid container direction="column" justify="space-between">
                        <Grid item>
                            <Card>
                                <GreetingCard />
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card>
                                <ScheduleInfo schedule={schedule} />
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ContentLayout />
                </Grid>
            </Grid>
        </Container>
    );
}
