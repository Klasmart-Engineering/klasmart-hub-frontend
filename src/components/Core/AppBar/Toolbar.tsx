import CreateOrganizationDialog from "../../styled/navbar/settings/createOrganization";
import UserProfileMenu from "./UserProfileMenu";
import { useGetUser } from "@/api/users";
import KidsloopLogo from "@/assets/img/kidsloop.svg";
import {
    currentMembershipVar,
    userIdVar,
} from "@/cache";
import { usePermission } from "@/utils/checkAllowed";
import { useReactiveVar } from "@apollo/client/react";
import {
    AppBar,
    Box,
    Button,
    createStyles,
    Grid,
    makeStyles,
    Theme,
    Toolbar as AppToolbar,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import clsx from "clsx";
import {
    IconButton,
    Tabs,
} from "kidsloop-px";
import { Tab } from "kidsloop-px/dist/types/components/Tabs";
import React from "react";
import { useIntl } from "react-intl";
import {
    Link,
    useLocation,
} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => createStyles({
    logo: {
        backgroundColor: `#FFF`,
        borderRadius: 12,
        "&:hover": {
            backgroundColor: theme.palette.grey[300],
        },
    },
    avatar: {
        margin: theme.spacing(0, 1),
    },
    menuButton: {
        marginLeft: theme.spacing(-1),
        marginRight: theme.spacing(2),
        color: `black`,
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
    tabs: {
        padding: theme.spacing(0, 2),
    },
    appBar: {
        transition: theme.transitions.create([ `margin`, `width` ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        transition: theme.transitions.create([ `margin`, `width` ], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
}));

interface Props {
    sideNavigationDrawerOpen: boolean | undefined;
    onMenuButtonClick: () => void;
}

export default function Toolbar (props: Props) {
    const { sideNavigationDrawerOpen, onMenuButtonClick } = props;
    const classes = useStyles();
    const theme = useTheme();
    const location = useLocation();
    const intl = useIntl();
    const minHeight = useMediaQuery(theme.breakpoints.up(`sm`)) ? 64 : 56;

    const selectedOrganizationMeta = useReactiveVar(currentMembershipVar);
    const userId = useReactiveVar(userIdVar);
    const {
        data: userData,
        loading,
        error,
    } = useGetUser({
        variables: {
            user_id: userId,
        },
    });

    const selectedMembershipOrganization = userData?.user?.memberships?.find((membership) => membership.organization_id === selectedOrganizationMeta.organization_id);
    const showMenuToRoles = [
        `Super Admin`,
        `Organization Admin`,
        `School Admin`,
        `Teacher`,
    ];
    const showNavMenu = selectedMembershipOrganization?.roles?.map((role) => role.role_name).some((roleName) => showMenuToRoles.includes(roleName ?? ``));
    const isEmptyMembership = Object.values(selectedOrganizationMeta).reduce((str, element) => str + element);

    const contentTabs: Tab[] = [
        {
            text: `Organization Content`,
            value: `/library`,
        },
        {
            text: `Badanamu Content`,
            value: `/badanamu-content`,
        },
    ];

    const findTabs = (tabs: Tab[], path: string) => tabs.find((tab) => tab.value === path) ? tabs : undefined;

    const getTabs = (path: string): Tab[] => {
        return findTabs(contentTabs, path)
        // ?? findTabs(adminTabs, path)
        ?? [];
    };

    const tabs = getTabs(location.pathname).map((tab: { text: string; value: string }) => ({
        ...tab,
        text: intl.formatMessage({
            id: `navbar_${tab.text.split(` `).join(``)}Tab`,
        }),
    }));

    return (
        <AppBar
            color="primary"
            position="relative"
            className={clsx(classes.safeArea, classes.appBar, {
                [classes.appBarShift]: sideNavigationDrawerOpen !== false,
            })}
        >
            <AppToolbar>
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
                        alignItems="center"
                        flexWrap="nowrap"
                        order={1}
                    >
                        <IconButton
                            className={classes.menuButton}
                            icon={MenuIcon}
                            onClick={() => onMenuButtonClick()}
                        />
                        <div>
                            <Button
                                className={classes.logo}
                                component={Link}
                                to="/"
                            >
                                <img
                                    src={KidsloopLogo}
                                    height="40"/>
                            </Button>
                        </div>
                    </Box>
                    <Box
                        display="flex"
                        order={2}>
                        {!loading && !error && isEmptyMembership === `` &&
                                <CreateOrganizationDialog />
                        }
                        <UserProfileMenu
                            user={userData?.user}
                            loading={loading}
                            error={error}
                        />
                    </Box>
                </Grid>
            </AppToolbar>
            {tabs.length > 0 &&
                    <Tabs
                        valuesAsPaths
                        className={classes.tabs}
                        tabs={tabs}
                        value={location.pathname}
                    />
            }
        </AppBar>
    );
}
