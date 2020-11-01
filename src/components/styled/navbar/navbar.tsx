import { Link, Paper } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import SettingsIcon from "@material-ui/icons/Settings";
import * as QueryString from "query-string";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import { useHistory } from "react-router-dom";
import { ActionTypes } from "../../../store/actions";
import { State } from "../../../store/store";
import NavButton from "./navButton";
import NavMenu from "./navMenu";
import ClassSettings from "./settings/classSettings";
import UserSettings from "./settings/userSettings";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        avatar: {
            margin: theme.spacing(0, 1),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        profileButton: {
            backgroundColor: "white",
            border: "1px solid #efefef",
            borderRadius: 12,
        },
        root: {
            flexGrow: 1,
        },
        safeArea: {
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
            zIndex: theme.zIndex.drawer + 1,
        },
        title: {
            flex: 1,
            // marginLeft: theme.spacing(2),
        },
    }),
);

interface MenuButtonProps {
    labels: Array<{ name: string; path: string; }>;
}

function MenuButtons(props: MenuButtonProps) {
    const history = useHistory();
    const theme = useTheme();
    const { labels } = props;
    const minHeight = useMediaQuery(theme.breakpoints.up("sm")) ? 64 : 56;

    const store = useStore();
    const activeComponent = useSelector((state: State) => state.ui.activeComponentHome);
    const setActiveComponent = (value: string) => {
        store.dispatch({ type: ActionTypes.ACTIVE_COMPONENT_HOME, payload: value });
    };

    return (
        labels.map((value: { name: string; path: string; }) => (
            <NavButton
                key={`menuLabel-${value.name}`}
                onClick={() => {
                    setActiveComponent(value.name);
                    history.push(value.path);
                }}
                isActive={activeComponent === value.path.split("/").filter((x) => x)[0]}
                style={{ minHeight }}
            >
                <FormattedMessage id={`navMenu_${value.name}Label`} />
            </NavButton>
        ))
    );
}

interface LabelProps {
    classes: string;
}

function ClassroomLabel(props: LabelProps) {
    return (
        <Grid container item xs={10} direction="row" justify="flex-start" alignItems="flex-start">
            <Grid item xs={12}>
                <Typography variant="body1" className={props.classes} noWrap>
                    KidsLoop Co., Ltd.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body2" className={props.classes} noWrap>
                    Alpha Release
                </Typography>
            </Grid>
        </Grid>
    );
}

interface Props {
    menuLabels?: Array<{ name: string; path: string; }>;
}

export default function NavBar(props: Props) {
    const classes = useStyles();
    const store = useStore();
    const theme = useTheme();
    const history = useHistory();
    const { menuLabels } = props;
    const url = new URL(window.location.href);

    const minHeight = useMediaQuery(theme.breakpoints.up("sm")) ? 64 : 56;

    const handleClickOpen = () => {
        store.dispatch({ type: ActionTypes.CLASS_SETTINGS_TOGGLE, payload: true });
    };

    return (
        <div className={classes.root}>
            <AppBar color="inherit" position="sticky" className={classes.safeArea}>
                <Toolbar>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        style={{ minHeight }}
                    >
                        <Grid
                            container item
                            xs={12} md={4} lg={3}
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                            wrap="nowrap"
                            style={{ minHeight }}
                        >
                            <Grid container item xs={8} direction="row"
                                wrap="nowrap">
                                {/* <NavMenu /> */}
                                <ClassroomLabel classes={classes.title} />
                            </Grid>
                            <Hidden mdUp>
                                <Grid
                                    container item
                                    xs={4}
                                    justify="flex-end"
                                    direction="row"
                                    alignItems="center"
                                    wrap="nowrap"
                                >
                                    <UserSettings />
                                </Grid>
                            </Hidden>
                        </Grid>
                        <Grid
                            container item
                            xs={12} md={4} lg={6}
                            direction="row"
                            justify="center"
                            wrap="nowrap"
                        >
                            {menuLabels ? <MenuButtons labels={menuLabels} /> : null}
                        </Grid>
                        <Hidden smDown>
                            <Grid
                                container item
                                md={4} lg={3}
                                direction="row"
                                justify="flex-end"
                                alignItems="center"
                                wrap="nowrap"
                            >
                                <UserSettings />
                            </Grid>
                        </Hidden>
                    </Grid>
                </Toolbar>
            </AppBar>
            {
                url.hash.includes("#/library") || url.hash.includes("#/badanamu-content") ?
                    <Grid
                        container
                        direction="row"
                    >
                        <Paper square style={{ flex: 1, height: "100%" }}>
                            <Toolbar variant="dense">
                                <Grid container direction="row" spacing={2}>
                                    <Grid item>
                                        <Link
                                            href="#"
                                            variant="body2"
                                            onClick={(e: React.MouseEvent) => { history.push("/library"); e.preventDefault(); }}
                                            style={{
                                                color: url.hash.includes("#/library") ? "#0E78D5" : "black",
                                                textDecoration: url.hash.includes("#/library") ? "underline" : "none",
                                            }}
                                        >
                                            Organization Content
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link
                                            href="#"
                                            variant="body2"
                                            onClick={(e: React.MouseEvent) => { history.push("/badanamu-content"); e.preventDefault(); }}
                                            style={{
                                                color: url.hash.includes("#/badanamu-content") ? "#0E78D5" : "black",
                                                textDecoration: url.hash.includes("#/badanamu-content") ? "underline" : "none",
                                            }}
                                        >
                                            Badanamu Content
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Toolbar>
                        </Paper>
                    </Grid>
                    : null
            }
            <ClassSettings />
        </div>
    );
}
