import React, { useEffect, useState, useContext, useRef } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Lightswitch from "../../components/lightswitch";
import LanguageSelect from "../../components/languageSelect";
import PolicyLink from "../../components/policyLinks";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles((theme) => createStyles(
    {
        card: {
            display: "flex",
            alignItems: "center",
            padding: "48px 40px !important",
        },
        pageWrapper: {
            height: "100%",
            display: "flex",
            flexGrow: 1,
        },
    }
));

interface Props {
    children: React.ReactNode;
    inFlight?: boolean;
}

export function Passwords(props: Props) {
    const classes = useStyles();
    const { children, inFlight } = props;

    return (
        <Grid
            container
            direction="column"
            justify="space-around"
            alignItems="center"
            className={classes.pageWrapper}
        >
            <Container maxWidth="xs">
                <Card>
                    <LinearProgress hidden={inFlight ? !inFlight : true} />
                    <CardContent className={classes.card}>
                        {children}
                    </CardContent>
                </Card>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item xs={1}>
                        <Lightswitch iconOnly />
                    </Grid>
                    <Grid item xs={5}>
                        <LanguageSelect noIcon />
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    );
}