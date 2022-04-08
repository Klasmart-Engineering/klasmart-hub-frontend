import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { useGetStudentAssignmentCompletion } from "@kl-engineering/reports-api-client";
import { FiberManualRecord } from "@mui/icons-material";
import {
    Theme,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React,
{ useMemo } from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles(((theme: Theme) => createStyles({
    widgetContent: {
        height: `100%`,
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `space-between`,
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
    titleBullet: {
        color: theme.palette.info.light,
        fontSize: 10,
    },
    list: {
        display: `flex`,
        flexDirection: `row`,
        justifyContent: `space-around`,
        [theme.breakpoints.down(`xs`)]: {
            flexDirection: `column`,
        },
    },
    listItem: {
        width: `32%`,
        [theme.breakpoints.down(`xs`)]: {
            width: `100%`,
            marginBottom: `5px`,
        },
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        justifyItems: `center`,
        backgroundColor: theme.palette.grey[100],
        padding: `0.9rem 0 0.9rem 0`,
        borderRadius: `0.5rem`,
    },
    data: {
        display: `flex`,
        flexDirection: `row`,
        alignItems: `baseline`,
    },
    dataTitle: {
        fontSize: 14,
        fontWeight: 400,
    },
    dataCount: {
        fontSize: 20,
        fontWeight: 600,
    },
    dataPercentage: {
        fontSize: 16,
        fontWeight: 600,
    },
    barContainer: {
        [theme.breakpoints.down(`xs`)]: {
            display: `none`,
        },
    },
    bar: {
        display: `flex`,
        flexDirection: `row`,
        height: `50px`,
        color: `#FFFFFF`,
        fontSize: 18,
        justifyContent: `middle`,
    },
    barLeft: {
        display: `flex`,
        alignItems: `center`,
        backgroundColor: theme.palette.info.light,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        paddingLeft: 10,
    },
    barRight: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `flex-end`,
        backgroundColor: theme.palette.error.light,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        paddingRight: 10,
    },
    barFooter: {
        display: `flex`,
        justifyContent: `space-between`,
    },
    barFooterLeft: {
        fontSize: 12,
        display: `flex`,
        justifySelf: `flex-start`,
        color: theme.palette.info.light,
        paddingLeft: 10,
    },
    barFooterRight: {
        fontSize: 12,
        display: `flex`,
        justifySelf: `flex-end`,
        color: theme.palette.error.light,
        paddingRight: 10,
    },
    warning: {
        color: theme.palette.error.light,
    },
    light: {
        color: theme.palette.info.light,
    },
})));

export default function CompletionWidget () {
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;
    const {
        data,
        isLoading: isAssignmentCompletionLoading,
        error: isAssignmentCompletionError,
        refetch,
    } = useGetStudentAssignmentCompletion({
        org: organizationId,
    });
    const intl = useIntl();
    const classes = useStyles();
    const completionData = useMemo(() => {
        if (!data?.successful) return;
        const info = data.info;
        return {
            ...info,
            completed_perc: info.completed_perc * 100,
            incomplete_perc: info.incomplete_perc * 100,
        };
    }, [ data ]);

    return (
        <WidgetWrapper
            label={
                intl.formatMessage({
                    id: `home.student.completionWidget.containerTitleLabel`,
                })
            }
            loading={isAssignmentCompletionLoading}
            error={isAssignmentCompletionError}
            noData={!data?.successful}
            reload={refetch}
            link={{
                url: `reports`,
                label: intl.formatMessage({
                    id: `home.student.completionWidget.containerUrlLabel`,
                }),
            }}
            id={WidgetType.COMPLETION}
        >
            {completionData &&
                <div className={classes.widgetContent}>
                    <div className={classes.titleWrapper}>
                        <FiberManualRecord className={classes.titleBullet} />
                        <Typography className={classes.title}>
                            <FormattedMessage id="home.student.completionWidget.title" />
                        </Typography>
                    </div>
                    <div className={classes.barContainer}>
                        <div className={classes.bar} >
                            <div
                                className={classes.barLeft}
                                style={{
                                    width: `${completionData.completed_perc}%`,
                                }}
                            >
                                <Typography>
                                    {completionData.completed_perc}%
                                </Typography>
                            </div>
                            <div
                                className={classes.barRight}
                                style={{
                                    width: `${completionData.incomplete_perc}%`,
                                }}
                            >
                                <Typography>
                                    {completionData.incomplete_perc}%
                                </Typography>
                            </div>
                        </div>
                        <div className={classes.barFooter}>
                            <Typography className={classes.barFooterLeft}>
                                <FormattedMessage id="home.student.completionWidget.legendCompleted" />
                            </Typography>
                            <Typography className={classes.barFooterRight}>
                                <FormattedMessage id="home.student.completionWidget.legendIncomplete" />
                            </Typography>
                        </div>
                    </div>
                    <div className={classes.list} >
                        <div className={classes.listItem}>
                            <Typography className={classes.dataTitle}>
                                <FormattedMessage id="home.student.completionWidget.totalAssignment" />
                            </Typography>
                            <div className={classes.data}>
                                <Typography className={classes.dataCount}>
                                    {completionData.total}
                                </Typography>
                            </div>
                        </div>
                        <div className={classes.listItem}>
                            <Typography className={classes.dataTitle}>
                                <FormattedMessage id="home.student.completionWidget.legendCompleted" />
                            </Typography>
                            <div className={`${classes.data} ${classes.light}`}>
                                <Typography className={classes.dataCount}>
                                    {completionData.completed}
                                </Typography>
                                <Typography className={classes.dataPercentage}>
                                    ({completionData.completed_perc}%)
                                </Typography>
                            </div>
                        </div>
                        <div className={classes.listItem}>
                            <Typography className={classes.dataTitle}>
                                <FormattedMessage id="home.student.completionWidget.legendIncomplete" />
                            </Typography>
                            <div className={`${classes.data} ${classes.warning}`}>
                                <Typography className={classes.dataCount}>
                                    {completionData.incomplete}
                                </Typography>
                                <Typography className={classes.dataPercentage}>
                                    ({completionData.incomplete_perc}%)
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>}
        </WidgetWrapper>
    );
}
