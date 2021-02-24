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
import { usePermission } from "@/utils/checkAllowed";
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
    makeStyles,
    Theme,
    Toolbar,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Tabs } from "kidsloop-px";
import { Tab } from "kidsloop-px/dist/types/components/Tabs";
import React from "react";
import { useLocation } from "react-router-dom";

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
        tabs: {
            padding: theme.spacing(0, 2),
        },
    }),
);

const getContentTabs = (): Tab[] => [
    {
        text: `Organization Content`,
        value: `/library`,
    },
    {
        text: `Badanamu Content`,
        value: `/badanamu-content`,
    },
];

const getAdminTabs = (): Tab[] => [
    {
        text: `Organizations`,
        value: `/admin/organizations`,
    },
    {
        text: `Users`,
        value: `/admin/users`,
    },
    {
        text: `Roles`,
        value: `/admin/roles`,
    },
    {
        text: `Schools`,
        value: `/admin/schools`,
    },
    {
        text: `Classes`,
        value: `/admin/classes`,
    },
    // {
    //     text: `Programs`,
    //     value: `/admin/programs`,
    // },
    // {
    //     text: `Grades`,
    //     value: `/admin/grades`,
    // },
    ...usePermission(`define_subject_page_20106`) ? [
        {
            text: `Subjects`,
            value: `/admin/subjects`,
        },
    ] : [],
];

const findTabs = (tabs: Tab[], path: string) => tabs.find((tab) => tab.value === path) ? tabs : undefined;

const getTabs = (path: string): Tab[] => {
    return findTabs(getContentTabs(), path)
        ?? findTabs(getAdminTabs(), path)
        ?? [];
};

interface Props {
}

export default function NavBar(props: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const location = useLocation();
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
    const tabs = getTabs(location.pathname);

    return (
        <div className={classes.root}>
            <AppBar
                color="primary"
                position="sticky"
                className={classes.safeArea}
            >
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
                {tabs.length > 0 && <Tabs
                    valuesAsPaths
                    className={classes.tabs}
                    tabs={tabs}
                    value={location.pathname}
                />}
            </AppBar>
            <ClassSettings />
        </div>
    );
}
