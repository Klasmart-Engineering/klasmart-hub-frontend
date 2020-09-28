import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { FormattedDate, FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { redirectIfUnauthorized } from "../components/authorized";
import { State } from "../store/store";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        alignItems: "center",
        display: "flex",
        padding: "48px 40px !important",
    },
    row: {
        textAlign: "left",
    },
    emptySpace: {
        padding: theme.spacing(4),
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(2),
        },
    },
    bigAvatar: {
        width: 96,
        height: 96,
    },
    sectionDivider: {
        margin: theme.spacing(2, 0),
    },
    productImgContainer: {
        textAlign: "right",
        minHeight: 96,
        margin: 0,
        padding: theme.spacing(4, 0),
        [theme.breakpoints.down("sm")]: {
            minHeight: 72,
        },
    },
    productImg: {
        maxWidth: 192,
        [theme.breakpoints.down("sm")]: {
            maxWidth: 128,
        },
    },
    sectionTypography: {
        textAlign: "right",
        [theme.breakpoints.down("xs")]: {
            textAlign: "left",
        },
    },
}),
);

export function MyAccount() {
    const classes = useStyles();
    const history = useHistory();
    const defaultEmail = useSelector((state: State) => state.account.email || "");

    redirectIfUnauthorized("/my-account");

    return (
        <Container maxWidth="lg" >
            <div className={classes.emptySpace} />
            <Grid container direction="row" spacing={4} >
                <Grid item xs={12}>
                    <Typography variant="h2">
                        <FormattedMessage id="my_account_header" />
                    </Typography>
                    <Divider light className={classes.sectionDivider} />
                    <Grid container item direction="row" spacing={4} xs={12}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h6" style={{ color: "#aaa" }}><FormattedMessage id="my_account_plan_profile" /></Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Typography variant="h6" className={classes.sectionTypography}>{defaultEmail}</Typography>
                            <Typography variant="h6" className={classes.sectionTypography}>
                                <Link
                                    href="#"
                                    variant="subtitle2"
                                    onClick={(e: React.MouseEvent) => { history.push("/password-change"); e.preventDefault(); }}
                                >
                                    <FormattedMessage id="password_change" />
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container >
    );
}
