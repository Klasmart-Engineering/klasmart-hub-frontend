import NavMenu from "./navMenu";
import ClassSettings from "./settings/classSettings";
import CreateOrganizationDialog from "./settings/createOrganization";
import UserSettings from "./settings/userSettings";
import KidsloopLogo from "@/assets/img/kidsloop.svg";
import {
    currentMembershipVar,
    userIdVar,
} from "@/cache";
import { GET_USER } from "@/operations/queries/getUser";
import { User } from "@/types/graphQL";
import { history } from "@/utils/history";
import {
    useQuery,
    useReactiveVar,
} from "@apollo/client/react";
import {
    AppBar,
    Box,
    Button,
    createStyles,
    Grid,
    Link,
    makeStyles,
    Paper,
    Theme,
    Toolbar,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        logo: {
            backgroundColor: `#FFF`,
            borderRadius: 12,
            color: theme.palette.getContrastText(`#FFF`),
            "&:hover": {
                backgroundColor: theme.palette.grey[300],
            },
        },
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
            paddingLeft: `env(safe-area-inset-left)`,
            paddingRight: `env(safe-area-inset-right)`,
            zIndex: theme.zIndex.drawer + 1,
        },
        title: {
            flex: 1,
            marginLeft: theme.spacing(2),
        },
    }),
);

interface Props {
    menuLabels?: Array<{ name: string; path: string }>;
}

export default function NavBar(props: Props) {
    const { menuLabels } = props;
    const classes = useStyles();
    const theme = useTheme();
    const url = new URL(window.location.href);

    const minHeight = useMediaQuery(theme.breakpoints.up(`sm`)) ? 64 : 56;

    const selectedOrganizationMeta = useReactiveVar(currentMembershipVar);
    const userId = useReactiveVar(userIdVar);
    const {
        data,
        loading,
        error,
    } = useQuery(GET_USER,
        {
            fetchPolicy: `network-only`,
            variables: {
                user_id: userId,
            },
        });
    const user: User = data?.user;

    const selectedMembershipOrganization = user?.memberships?.find((membership) => membership.organization_id === selectedOrganizationMeta.organization_id);
    const showMenuToRoles = [
        `Super Admin`,
        `Organization Admin`,
        `School Admin`,
        `Teacher`,
    ];
    const showNavMenu = selectedMembershipOrganization?.roles?.map((role) => role.role_name).some((roleName) => showMenuToRoles.includes(roleName ?? ``));
    const isEmptyMembership = Object.values(selectedOrganizationMeta).reduce((str, element) => str + element);

    return (
        <div className={classes.root}>
            <AppBar
                color="primary"
                position="sticky"
                className={classes.safeArea}>
                <Toolbar>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        style={{
                            minHeight,
                        }}
                    >
                        <Box
                            display="flex"
                            flexDirection="row"
                            flexWrap="nowrap"
                            order={1}
                        >
                            { showNavMenu && <NavMenu className={classes.menuButton}/> }
                            <Button
                                className={classes.logo}
                                onClick={() => { history.push(`/`); }}
                            >
                                <img
                                    src={KidsloopLogo}
                                    height="40"/>
                            </Button>
                        </Box>
                        <Box
                            display="flex"
                            order={2}>
                            {!loading && !error && isEmptyMembership === `` &&
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
                url.hash.includes(`#/library`) || url.hash.includes(`#/badanamu-content`) ?
                    <Grid
                        container
                        direction="row"
                    >
                        <Paper
                            square
                            style={{
                                flex: 1,
                                height: `100%`,
                            }}>
                            <Toolbar variant="dense">
                                <Grid
                                    container
                                    direction="row"
                                    spacing={2}>
                                    <Grid item>
                                        <Link
                                            href="#"
                                            variant="body2"
                                            style={{
                                                color: url.hash.includes(`#/library`) ? `#0E78D5` : `black`,
                                                textDecoration: url.hash.includes(`#/library`) ? `underline` : `none`,
                                            }}
                                            onClick={(e: React.MouseEvent) => { history.push(`/library`); e.preventDefault(); }}
                                        >
                                            Organization Content
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link
                                            href="#"
                                            variant="body2"
                                            style={{
                                                color: url.hash.includes(`#/badanamu-content`) ? `#0E78D5` : `black`,
                                                textDecoration: url.hash.includes(`#/badanamu-content`) ? `underline` : `none`,
                                            }}
                                            onClick={(e: React.MouseEvent) => { history.push(`/badanamu-content`); e.preventDefault(); }}
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
