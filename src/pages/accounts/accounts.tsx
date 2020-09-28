import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import LinearProgress from "@material-ui/core/LinearProgress";

import Copyright from "../../components/copyright";
import LanguageSelect from "../../components/languageSelect";
import Lightswitch from "../../components/lightswitch";
import PolicyLink from "../../components/policyLinks";

const useStyles = makeStyles((theme) => createStyles(
    {
        content: {
            height: "100%",
            flexGrow: 1,
            flexWrap: "nowrap",
            padding: "32px 0",
        },
        card: {
            display: "flex",
            alignItems: "center",
            padding: "48px 40px !important",
        },
        pageWrapper: {
            display: "flex",
            flexGrow: 1,
        },
        footer: {
            alignItems: "center",
            [theme.breakpoints.down("xs")]: {
                alignItems: "left",
            },
        },
    }
));

interface Props {
    children: React.ReactNode;
    inFlight?: boolean;
}

export function AccountsLayout(props: Props) {
    const classes = useStyles();
    const { children, inFlight } = props;

    return (
        <Grid
            container
            className={classes.content}
            direction="column"
            justify="space-between"
            alignItems="center"
        >
            {/* Empty grid item for `space-between` */}
            <Grid item></Grid>
            <Grid item></Grid>
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
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <Grid item xs={1}>
                            <Lightswitch iconOnly />
                        </Grid>
                        <Grid item xs={5}>
                            <LanguageSelect noIcon />
                        </Grid>
                        <Grid item xs={6}>
                            <PolicyLink />
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
            <Grid item className={classes.footer}>
                <Copyright />
            </Grid>
        </Grid >
    );
}