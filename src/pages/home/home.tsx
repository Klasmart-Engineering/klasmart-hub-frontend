import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import CardLayout from "./card/card";

import { mainNavBar } from "../../app";
import NavBar from "../../components/styled/navbar/navbar";
import LiveLayout from "./live/live";
import ScheduleCard from "./summary/scheduleCard";
import SummaryCard from "./summary/summaryCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: "#eef7fd",
            height: "100%",
            paddingBottom: theme.spacing(2),
            paddingTop: theme.spacing(2),
        },
    }),
);

export default function Home() {
    const classes = useStyles();

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
                    <LiveLayout />
                </Grid>
                <Grid item xs={12} md={8}>
                    <SummaryCard />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={4}>
                    <ScheduleCard />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={8}>
                    <SummaryCard />
                </Grid>
                <Grid item xs={12}>
                    <CardLayout />
                </Grid>
            </Grid>
        </Container>
    );
}
