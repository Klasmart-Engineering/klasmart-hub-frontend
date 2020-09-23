import { Box, CircularProgress, Container, Paper, Typography } from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector, useStore } from "react-redux";
import { mainNavBar } from "../../../app";
import CenterAlignChildren from "../../../components/centerAlignChildren";
import NavBar from "../../../components/styled/navbar/navbar";
import { State } from "../../../store/store";
import ContentCard from "./contentCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        liveButton: {
            backgroundColor: "#ff6961",
            color: "white",
        },
        liveTextWrapper: {
            backgroundColor: "#ff6961",
            borderRadius: 20,
            color: "white",
            fontSize: "0.6em",
            padding: theme.spacing(0.25, 0.75),
        },
        paperContainer: {
            margin: theme.spacing(4, 2),
            borderRadius: 12,
            boxShadow: theme.palette.type === "dark" ? "0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)" : "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
        },
        root: {
            height: "100%",
        },
    }),
);

export default function CardLayout() {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Container
            disableGutters
            maxWidth={"lg"}
        >
            <Box>
                <Grid item xs={12} style={{ margin: theme.spacing(0, 2) }}>
                    <CenterAlignChildren>
                        <Typography variant="h4">
                            Featured Content
                        </Typography>
                        <Typography variant="caption" style={{ marginLeft: theme.spacing(1)}}>
                            ( 1 of 2 )
                        </Typography>
                    </CenterAlignChildren>
                </Grid>
                <Paper elevation={4} className={classes.paperContainer}>
                    <ContentCard />
                </Paper>
            </Box>
        </Container>
    );
}
