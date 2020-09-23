import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import CardLayout from "./card/card";

import LiveLayout from "./live/live";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        layout: {
            flex: 1,
        },
        root: {
            height: "100%",
            paddingBottom: theme.spacing(4),
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(5),
            paddingTop: theme.spacing(4),
            width: "calc(100% - 2*1.5rem)",
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(2, 1),
            },
        },
        safeArea: {
            paddingBottom: theme.spacing(4),
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(5),
            paddingTop: theme.spacing(4),
            [theme.breakpoints.down("sm")]: {
                paddingBottom: theme.spacing(2),
                paddingLeft: `max(${theme.spacing(1)}px,env(safe-area-inset-left)`,
                paddingRight: `max(${theme.spacing(1)}px,env(safe-area-inset-right)`,
                paddingTop: theme.spacing(2),
            },
        },
    }),
);

export default function Home() {
    return (
        <Container
            disableGutters
            maxWidth={"lg"}
        >
            <LiveLayout />

            <Grid container>
                <Grid item xs={12} md={6} lg={12}>
                    <CardLayout />
                </Grid>
            </Grid>
        </Container>
    );
}
