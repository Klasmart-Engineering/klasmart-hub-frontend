import { useQuery, useReactiveVar } from "@apollo/client/react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useEffect, useState } from "react";
import { FormattedDate, FormattedTime } from "react-intl";

import { useRestAPI } from "../../api/restapi";
import { currentMembershipVar, userIdVar } from "../../cache";
import CenterAlignChildren from "../../components/centerAlignChildren";
import { User } from "../../models/Membership";
import { GET_USER } from "../../operations/queries/getUser";
import { SchedulePayload } from "../../types/objectTypes";
import Assessment from "./card/assessment";
import { schedulePayload } from "./card/payload";
import PlanSelection from "./card/planSelection";
import ScheduleInfo from "./card/scheduleInfo";
import UsageInfo from "./card/usageInfo";
import ContentLayout from "./featuredContent/contentLayout";

const payload = schedulePayload;

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

    const [time, setTime] = useState(Date.now());
    const [schedule, setSchedule] = useState<SchedulePayload[] | undefined>(payload);

    const currentOrganization = useReactiveVar(currentMembershipVar);
    const user_id = useReactiveVar(userIdVar);
    const { data, loading, error } = useQuery(GET_USER, {
        fetchPolicy: "network-only",
        variables: {
            user_id,
        },
    });
    const user: User = data?.user;

    async function getScheduleList() {
        try {
            const response = await restApi.schedule(currentOrganization.organization_id, "month", todayTimeStamp, timeZoneOffset);
            setSchedule(response);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => { clearInterval(interval); };
    }, []);

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
                spacing={4}
            >
                <Grid item xs={12} md={6} lg={4}>
                    <Grid
                        container
                        direction="row"
                        justify="space-around"
                        alignContent="center"
                        style={{ height: "100%" }}
                        spacing={2}
                    >
                        <Grid item>
                            <Typography variant="h4" align="center">
                                <FormattedTime value={time} hour="2-digit" minute="2-digit" />{" • "}
                                <FormattedDate value={time} month="short" day="numeric" weekday="short" />
                            </Typography>
                            <Typography variant="h4" align="center">
                                👋  Welcome, { user?.given_name }!
                            </Typography>
                        </Grid>
                        <UsageInfo schedule={schedule} />
                        <PlanSelection />
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Card>
                        <ScheduleInfo schedule={schedule} />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Card>
                        <Assessment />
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <ContentLayout />
                </Grid>
            </Grid>
        </Container>
    );
}
