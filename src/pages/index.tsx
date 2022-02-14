import Dashboard from "../components/Dashboard/dashboard";
import WidgetDashboard from "../components/Dashboard/widget-dashboard";
import DashboardNotice from "@/components/Dashboard/DashboardNotice";
import {
    DashboardMode,
    useDashboardMode,
} from "@/store/useDashboardMode";
import { usePermission } from "@/utils/permissions";
import CachedIcon from '@mui/icons-material/Cached';
import { CircularProgress } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React,
{
    useEffect,
    useMemo,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(() => createStyles({
    pageLoading: {
        display: `flex`,
        margin: `auto`,
        height: `100% !important`,
    },
}));

export default function HomePage () {
    const intl = useIntl();
    const classes = useStyles();
    const { hasPermission: permissionViewMyClassUser = false, loading: loadingPermissionViewMyClassUser } = usePermission(`view_my_class_users_40112`, true);
    const canTeacherViewWidgetDashboard = useMemo(() => permissionViewMyClassUser && process.env.SHOW_REPORT_CARDS === `true`, [ permissionViewMyClassUser ]);
    const showDashboardNotice = canTeacherViewWidgetDashboard && process.env.USE_MOCK_REPORTS_DATA === `true`;
    const [ dashboardMode, setDashboardMode ] = useDashboardMode();

    useEffect(() => {
        if (loadingPermissionViewMyClassUser) return;

        switch (dashboardMode) {
        case undefined:
            setDashboardMode(canTeacherViewWidgetDashboard ? DashboardMode.WIDGET : DashboardMode.ORIGINAL);
            break;
        case DashboardMode.WIDGET:
            if (!canTeacherViewWidgetDashboard)
                setDashboardMode(DashboardMode.ORIGINAL);
            break;
        default:
            break;
        }

    }, [ loadingPermissionViewMyClassUser ]);

    if (loadingPermissionViewMyClassUser)
        return <CircularProgress
            color="primary"
            className={classes.pageLoading}/>;

    if(dashboardMode === DashboardMode.WIDGET) {
        return (
            <>
                {showDashboardNotice &&
                    <DashboardNotice
                        title={
                            intl.formatMessage({
                                id: `newHome.dashboardNotice.title`,
                            })
                        }
                        subtitle={
                            intl.formatMessage({
                                id: `newHome.dashboardNotice.subtitle`,
                            })
                        }
                        button={{
                            label: intl.formatMessage({
                                id: `home.dashboardNotice.switchViewButton`,
                            }),
                            icon: <CachedIcon />,
                            onClick: () => {
                                setDashboardMode(DashboardMode.ORIGINAL);
                            },
                        }} />
                }
                <WidgetDashboard />
            </>
        );
    }

    return (
        <>
            {showDashboardNotice &&
                <DashboardNotice
                    title={
                        intl.formatMessage({
                            id: `home.dashboardNotice.title`,
                        })
                    }
                    button={{
                        label: intl.formatMessage({
                            id: `home.dashboardNotice.switchViewButton`,
                        }),
                        icon: <CachedIcon />,
                        onClick: () => { setDashboardMode(DashboardMode.WIDGET); },
                    }} />
            }
            <Dashboard permissionViewMyClassUser={permissionViewMyClassUser} />
        </>
    );
}
