import { useQuery, useReactiveVar } from "@apollo/client/react";
import { Link, Paper, Tooltip } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router-dom";
import { currentMembershipVar, userIdVar } from "../../../cache";
import { GET_USER } from "../../../operations/queries/getUser";
import { Role, RoleName, User } from "../../../types/graphQL";
import { history } from "../../../utils/history";
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

interface LabelProps {
    classes: string;
    organizationName?: string | null;
    roleName: string | null;
}

function ClassroomLabel(props: LabelProps) {
    const {
        classes,
        organizationName,
        roleName,
    } = props;

    return (
        <Tooltip title="Your currently selected organization" aria-label="selected-org" placement="bottom-start">
            <Grid container item xs={10} direction="row" justify="flex-start" alignItems="flex-start">
                <Grid item xs={12}>
                    <Typography variant="body1" className={classes} noWrap>
                        {organizationName ?? "Unknown organization"}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" className={classes} noWrap>
                        {roleName ?? "Unknown role"}
                    </Typography>
                </Grid>
            </Grid>
        </Tooltip>
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

    const user_id = useReactiveVar(userIdVar);
    const selectedOrganizationMeta = useReactiveVar(currentMembershipVar);
    const { data, loading, error } = useQuery(GET_USER, {
        fetchPolicy: "network-only",
        variables: {
            user_id,
        },
    });
    const user: User = data?.user;
    const selectedOrganization = user?.memberships?.find((membership) => membership.organization_id === selectedOrganizationMeta.organization_id);

    const getHighestRole = (roles?: Role[] | null) => {
        if (!roles?.length) { return null; }
        const rolePriority: RoleName[] = ["Organization Admin", "School Admin", "Teacher", "Parent", "Student"];
        const foundPriorityIndexes = roles
            .map(function(role) {
                const roleName = role.role_name as RoleName;
                return rolePriority.indexOf(roleName);
            })
            .filter((priority) => priority !== -1);
        if (!foundPriorityIndexes.length) { return null; }
        const highestPriorityIndex = Math.min(...foundPriorityIndexes);
        return rolePriority[highestPriorityIndex];
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
                            <Grid container item xs={8} direction="row" wrap="nowrap">
                                { ["Parent", "Student"].indexOf(getHighestRole(selectedOrganization?.roles) || "Student") === -1 && <NavMenu /> }
                                <ClassroomLabel
                                    classes={classes.title}
                                    organizationName={selectedOrganization?.organization?.organization_name}
                                    roleName={getHighestRole(selectedOrganization?.roles)}
                                />
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
                                    <UserSettings
                                        memberships={user?.memberships}
                                        loading={loading}
                                        error={error}
                                    />
                                </Grid>
                            </Hidden>
                        </Grid>
                        {url.hash.includes("#/admin") ? null :
                            <Grid
                                container item
                                xs={12} md={4} lg={6}
                                direction="row"
                                justify="center"
                                wrap="nowrap"
                            >
                                {menuLabels ? <MenuButtons labels={menuLabels} /> : null}
                            </Grid>
                        }
                        <Hidden smDown>
                            <Grid
                                container item
                                md={4} lg={3}
                                direction="row"
                                justify="flex-end"
                                alignItems="center"
                                wrap="nowrap"
                            >
                                <UserSettings
                                    memberships={user?.memberships}
                                    loading={loading}
                                    error={error}
                                />
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
