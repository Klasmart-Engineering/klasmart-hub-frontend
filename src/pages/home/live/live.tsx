import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";

import LiveCard from "./liveCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paperContainer: {
            margin: theme.spacing(4, 2),
            borderRadius: 12,
            boxShadow: theme.palette.type === "dark" ? "0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)" : "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
        },
    }),
);

export default function LiveLayout() {
    const classes = useStyles();

    return (
        <Container
            disableGutters
            maxWidth={"lg"}
        >
            <Box>
                <Paper elevation={4} className={classes.paperContainer}>
                    <LiveCard />
                </Paper>
            </Box>
        </Container>
    );
}
