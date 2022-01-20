
import attendanceRateDataFormatter from "./attendanceRateDataFormatter";
import DonutWithText from "@/components/Dashboard/Widgets/AttendanceRate/Donut/DonutWithText";
import Legend from "@/components/Dashboard/Widgets/AttendanceRate/Donut/Legend";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { useGetClassAttendanceRateGroup } from "@kidsloop/reports-api-client";
import {
    Theme,
    Typography,
    useTheme,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import { FiberManualRecord } from "@material-ui/icons";
import { useWidth } from "kidsloop-px";
import React,
{ useMemo } from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: `100%`,
            height: `90%`,
            display: `grid`,
        },
        rootDesktop: {
            gridTemplateColumns: `65% 35%`,
            gridTemplateRows: `100%`,
        },
        rootMobile: {
            gridTemplateColumns: `100%`,
            gridTemplateRows: `70% 30%`,
        },
        titleWrapper: {
            display: `flex`,
            alignItems: `center`,
        },
        title: {
            color: theme.palette.grey[600],
            fontSize: 12,
            marginLeft: 5,
        },
        icon: {
            color: theme.palette.info.light,
            fontSize: 10,
        },
    }));

export default function AttendanceRateWidget () {
    const theme = useTheme();
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;
    const width = useWidth();
    const {
        data,
        isFetching,
        error,
        refetch,
    } = useGetClassAttendanceRateGroup({
        org: organizationId,
    });

    const formattedData = useMemo(() => {
        if (!data) return [];
        return attendanceRateDataFormatter(data, theme);
    }, [ data ]);

    const defaultView = width !== `xs`;

    return (
        <WidgetWrapper
            loading={isFetching}
            error={error}
            noData={!data?.successful}
            reload={refetch}
            label="Attendance"
            link={{
                url: `reports`,
                label: `View all Attendance`,
            }}
        >
            <div className={classes.titleWrapper}>
                <FiberManualRecord className={classes.icon}/>
                <Typography className={classes.title}>Last 7 days</Typography>
            </div>

            {data && <div
                className={`${classes.root} ${defaultView ? classes.rootDesktop : classes.rootMobile}`} >
                <DonutWithText
                    data={formattedData}
                    options={{
                        pieSize: defaultView ? 100 : 70,
                        radiusWidth: defaultView? 24 : 16,
                        padAngle: 0,
                    }}
                />
                <Legend
                    data={formattedData}
                    format={defaultView ? `desktop` : `mobile`}/>
            </div>
            }
        </WidgetWrapper>
    );
}
