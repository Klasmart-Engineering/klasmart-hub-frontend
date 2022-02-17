import Dashboard from "@/components/Dashboard/Dashboard";
import DashboardNotice from "@/components/Dashboard/DashboardNotice";
import WidgetDashboard from "@/components/Dashboard/WidgetDashboard";
import { WidgetView } from "@/components/Dashboard/WidgetManagement/defaultWidgets";
import {
    DashboardMode,
    useDashboardMode,
} from "@/store/useDashboardMode";
import CachedIcon from '@mui/icons-material/Cached';
import { CircularProgress } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React,
{
    useEffect,
    useState,
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
    const [ showDashboardNotice, setShowDashboardNotice ] = useState(false);
    const {
        dashboardMode,
        setToWidgetDashboard,
        setToOriginalDashboard,
        loading,
        hasPermissionToViewWidgetDashboard,
        view,
    } = useDashboardMode();

    useEffect(() => {
        if(process.env.USE_MOCK_REPORTS_DATA !== `true` || loading) return;

        setShowDashboardNotice(hasPermissionToViewWidgetDashboard);
    }, [ loading, view ]);

    if (loading)
        return <CircularProgress
            color="primary"
            className={classes.pageLoading}/>;

    if(dashboardMode === DashboardMode.WIDGET && (view === WidgetView.STUDENT || view === WidgetView.TEACHER)) {
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
                                setToOriginalDashboard();
                            },
                        }} />
                }
                <WidgetDashboard view={view} />
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
                        onClick: () => {
                            setToWidgetDashboard();
                        },
                    }} />
            }
            <Dashboard />
        </>
    );
}
