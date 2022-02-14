
import { WidgetType } from "../../models/widget.model";
import contentStatusDataFormatter from "./contentStatusDataFormatter";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { useGetContentTeacher } from "@kidsloop/reports-api-client";
import { Theme, Typography } from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import { FiberManualRecord } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import React,
{ useMemo } from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles(((theme: Theme) => createStyles({
    widgetContent: {
        height: `100%`,
        display: `grid`,
        gridTemplateColumns: `1fr`,
        gridTemplateRows: `10% 1fr`,
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
        listStyle: `none`,
        padding: 0,
        margin:0,
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `space-around`,

    },
    listItem: {
        display: `grid`,
        gridTemplateRows: `1fr`,
        gridTemplateColumns: `45% 20% 35%`,
        alignItems: `center`,
        justifyItems:`center`,
        '&:not(:last-child)': {
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
        },
    },
    body2: {
        fontWeight: `bold`,
        justifySelf: `start`,
        paddingLeft: `1rem`,
    },
    caption: {
        justifySelf: `end`,
        paddingRight: `1rem`,
        color: theme.palette.grey[600],
    },
    count: {
        fontSize: 28,
        justifySelf: `end`,
        color: theme.palette.info.main,
    },
    countNegative: {
        color: theme.palette.error.light,
    },
})));

export default function ContentStatusWidget () {
    const intl = useIntl();
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;

    const {
        data,
        isFetching,
        error,
        refetch,
    } = useGetContentTeacher({
        org: organizationId,
    });

    const formattedData = useMemo(() => {
        if (!data) return;
        return contentStatusDataFormatter(data);
    }, [ data ]);

    return (
        <WidgetWrapper
            loading={isFetching}
            error={error}
            noData={!data?.successful}
            reload={refetch}
            label={
                intl.formatMessage({
                    id: `home.contentStatus.containerTitleLabel`,
                })
            }
            link={{
                url: `library/organization-content`,
                label: intl.formatMessage({
                    id: `home.contentStatus.containerUrlLabel`,
                }),
            }}
            id={WidgetType.CONTENTSTATUS}
        >
            <div className={classes.widgetContent}>
                <div className={classes.titleWrapper}>
                    <FiberManualRecord className={classes.titleBullet}/>
                    <Typography className={classes.title}>
                        <FormattedMessage id="home.contentStatus.timeFrame" />
                    </Typography>
                </div>
                <ul className={classes.list}>
                    <li className={classes.listItem}>
                        <Typography
                            variant="body2"
                            className={classes.body2}>
                            <FormattedMessage id="home.contentStatus.learningMaterialLabel" />
                        </Typography>
                        <Typography
                            className={classes.count}>
                            {formattedData?.total}
                        </Typography>
                        <Typography
                            variant="caption"
                            className={classes.caption}
                            color="textSecondary">
                            <FormattedMessage id="home.contentStatus.timeFrame" />
                        </Typography>
                    </li>
                    <li className={classes.listItem}>
                        <Typography
                            variant="body2"
                            className={classes.body2}>
                            <FormattedMessage id="home.contentStatus.totalApprovedLabel" />
                        </Typography>
                        <Typography
                            className={classes.count}>
                            {formattedData?.approved}
                        </Typography>
                        <Typography
                            variant="caption"
                            className={classes.caption}
                            color="textSecondary">
                            <FormattedMessage id="home.contentStatus.timeFrame" />
                        </Typography>
                    </li>
                    <li className={classes.listItem}>
                        <Typography
                            variant="body2"
                            className={classes.body2}>
                            <FormattedMessage id="home.contentStatus.totalPendingLabel" />
                        </Typography>
                        <Typography
                            className={clsx(classes.count, classes.countNegative)}>
                            {formattedData?.pending}
                        </Typography>
                        <Typography
                            variant="caption"
                            className={classes.caption}>
                            <FormattedMessage id="home.contentStatus.timeFrame" />
                        </Typography>
                    </li>
                    <li className={classes.listItem}>
                        <Typography
                            variant="body2"
                            className={classes.body2}>
                            <FormattedMessage id="home.contentStatus.totalRejectedLabel" />
                        </Typography>
                        <Typography
                            className={clsx(classes.count, classes.countNegative)}>
                            {formattedData?.rejected}
                        </Typography>
                        <Typography
                            variant="caption"
                            className={classes.caption}>
                            <FormattedMessage id="home.contentStatus.timeFrame" />
                        </Typography>
                    </li>
                </ul>
            </div>
        </WidgetWrapper>
    );
}
