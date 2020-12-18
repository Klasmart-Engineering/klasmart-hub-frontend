import { useQuery, useReactiveVar } from "@apollo/client/react";
import { Box, Button, Link, Paper } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router-dom";
import KidsloopLogo from "../../../assets/img/kidsloop.svg";
import { currentMembershipVar, userIdVar } from "../../../cache";
import { GET_USER } from "../../../operations/queries/getUser";
import { User } from "../../../types/graphQL";
import { history } from "../../../utils/history";
import { getHighestRole } from "../../../utils/userRoles";
import StyledButton from "../button";
import NavButton from "./navButton";
import NavMenu from "./navMenu";
import ClassSettings from "./settings/classSettings";
import CreateOrganizationDialog from "./settings/createOrganization";
import UserSettings from "./settings/userSettings";

const breakpoint = 827; // current max width before the toolbar items start to wrap

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        avatar: {
            margin: theme.spacing(0, 1),
        },
        menuButton: {
            marginRight: theme.spacing(2),
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
            marginLeft: theme.spacing(2),
        },
    }),
);

interface MenuButtonProps {
    labels: Array<{ name: string; path: string; }>;
}

function MenuButtons(props: MenuButtonProps) {
    const theme = useTheme();
    const { labels } = props;
    const minHeight = useMediaQuery(theme.breakpoints.up("sm")) ? 64 : 56;
    const location = useLocation();
    return (
        <>
            {labels.map((label) => (
                <NavButton
                    key={`menuLabel-${label.name}`}
                    onClick={(e) => {
                        history.push(label.path);
                        e.preventDefault();
                    }}
                    isActive={label.path === location.pathname}
                    style={{ minHeight }}
                >
                    <FormattedMessage id={`navMenu_${label.name}Label`} />
                </NavButton>
            ))}
        </>
    );
}

interface Props {
    menuLabels?: Array<{ name: string; path: string; }>;
}

export default function NavBar(props: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const { menuLabels } = props;
    const url = new URL(window.location.href);

    const minHeight = useMediaQuery(theme.breakpoints.up("sm")) ? 64 : 56;

    const selectedOrganizationMeta = useReactiveVar(currentMembershipVar);
    const user_id = useReactiveVar(userIdVar);
    const { data, loading, error } = useQuery(GET_USER, {
        fetchPolicy: "network-only",
        variables: {
            user_id,
        },
    });
    const user: User = data?.user;

    const selectedMembershipOrganization = user?.memberships?.find((membership) => membership.organization_id === selectedOrganizationMeta.organization_id);
    const highestRole = getHighestRole(selectedMembershipOrganization?.roles) || "Unknown";
    const showNavMenu = ["Organization Admin", "School Admin", "Teacher"].indexOf(highestRole);

    const isEmptyMembership = Object.values(selectedOrganizationMeta).reduce((str, element) => str + element);

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
                        <Box
                            display="flex"
                            flexDirection="row"
                            flexWrap="nowrap"
                            order={1}
                        >
                            { showNavMenu !== -1 && <NavMenu className={classes.menuButton}/> }
                            <Button
                                onClick={() => { history.push("/"); }}
                            >
                                <img src={KidsloopLogo} height="40"/>
                            </Button>
                        </Box>
                        <Box display="flex" order={2}>
                            {!loading && !error && isEmptyMembership === "" &&
                                <CreateOrganizationDialog />
                            }
                            <UserSettings
                                user={user}
                                loading={loading}
                                error={error}
                            />
                        </Box>
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
