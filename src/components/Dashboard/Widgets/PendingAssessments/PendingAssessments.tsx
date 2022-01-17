
import pendingAssesmentsDataFormatter from "./pendingAssesmentsDataFormatter";
import ProgressBar from "@/components/Dashboard/Widgets/PendingAssessments/ProgressBar";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { useGetPendingAssignments } from "@kidsloop/reports-api-client";
import {
    createStyles,
    List,
    ListItem,
    SvgIcon,
    Theme,
    Typography,
} from "@material-ui/core";
import { FiberManualRecord } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { sumBy } from "lodash";
import React,
{ useMemo } from "react";

const useStyles = makeStyles((theme:Theme) => createStyles({
    widgetContent: {
        height: `100%`,
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `center`,
    },
    row: {
        display: `grid`,
        gridTemplateColumns: `15% 30% 15% 1fr`,
        [theme.breakpoints.down(`xs`)]: {
            gridTemplateColumns: `15% 1fr 15%`,
        },
        gridTemplateRows: `1fr`,
        gridColumnGap: theme.spacing(1.25),
        alignItems: `center`,
        width: `100%`,
        marginBottom: theme.spacing(1.25),
    },
    rowIcon: {
        color: theme.palette.getContrastText(theme.palette.text.primary),
        borderRadius: `100%`,
        padding: 5,
        fontSize: 35,
    },
    progressBar: {
        [theme.breakpoints.down(`xs`)]: {
            display: `none`,
        },
    },
    text: {
        fontSize: 14,
        color: theme.palette.text.primary,
    },
    titleWrapper: {
        display: `flex`,
        alignItems: `center`,
        marginTop: 18,
    },
    title: {
        color: theme.palette.grey[600],
        fontSize: 12,
        marginLeft: 5,
    },
    bullet: {
        color: theme.palette.info.light,
        fontSize: 10,
    },
}));

export default function PendingAssessmentsWidget () {
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;

    const {
        data,
        isFetching,
        error,
        refetch,
    } = useGetPendingAssignments({
        org: organizationId,
    });

    const formattedData = useMemo(() => {
        if (!data) return [];
        return pendingAssesmentsDataFormatter(data);
    }, [ data ]);

    const total: number = sumBy(formattedData, (item) => item.count);

    return (
        <WidgetWrapper
            loading={isFetching}
            error={error}
            noData={!data?.successful}
            reload={refetch}
            label="Pending Assessments"
            link={{
                url: `assessments`,
                label: `View all assessments`,
            }}>
            <div className={classes.widgetContent}>
                <div className={classes.titleWrapper}>
                    <FiberManualRecord className={classes.bullet}/>
                    <Typography className={classes.title}>All Time</Typography>
                </div>
                {formattedData &&
                    <List>
                        {formattedData.map((item, index:number)=>{
                            return <ListItem key={index}>
                                <div className={classes.row}>
                                    <SvgIcon
                                        component={item.icon}
                                        className={classes.rowIcon}
                                        style={{
                                            backgroundColor: item.color,
                                        }} />
                                    <div className={classes.text}>
                                        {item.intlKey}
                                    </div>
                                    <div
                                        className={classes.text}
                                        style={{
                                            color: item.color,
                                            fontSize: 24,
                                        }}>
                                        {item.count}
                                    </div>
                                    <div className={classes.progressBar}>
                                        <ProgressBar
                                            total={total}
                                            progress={item.count}
                                            color={item.color}
                                            thickness={15}
                                        />
                                    </div>
                                </div>
                            </ListItem>;
                        })}
                    </List>
                }
            </div>
        </WidgetWrapper>
    );
}