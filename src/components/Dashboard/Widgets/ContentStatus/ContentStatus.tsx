
import contentStatusDataFormatter from "./contentStatusDataFormatter";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { useGetContentTeacher } from "@kidsloop/reports-api-client";
import {
    createStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import { FiberManualRecord } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import React,
{ useMemo } from "react";

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
            label="Content Status"
            link={{
                url: `library/organization-content`,
                label: `View all content status`,
            }}>
            <div className={classes.widgetContent}>
                <div className={classes.titleWrapper}>
                    <FiberManualRecord className={classes.titleBullet}/>
                    <Typography className={classes.title}>All Time</Typography>
                </div>
                <ul className={classes.list}>
                    <li className={classes.listItem}>
                        <Typography
                            variant="body2"
                            className={classes.body2}>
                                Learning material
                        </Typography>
                        <Typography
                            className={classes.count}>
                            {formattedData?.total}
                        </Typography>
                        <Typography
                            variant="caption"
                            className={classes.caption}
                            color="textSecondary">
                                This week
                        </Typography>
                    </li>
                    <li className={classes.listItem}>
                        <Typography
                            variant="body2"
                            className={classes.body2}>
                                Total Approved
                        </Typography>
                        <Typography
                            className={classes.count}>
                            {formattedData?.approved}
                        </Typography>
                        <Typography
                            variant="caption"
                            className={classes.caption}
                            color="textSecondary">This week
                        </Typography>
                    </li>
                    <li className={classes.listItem}>
                        <Typography
                            variant="body2"
                            className={classes.body2}>Total Pending</Typography>
                        <Typography
                            className={clsx(classes.count, classes.countNegative)}>
                            {formattedData?.pending}
                        </Typography>
                        <Typography
                            variant="caption"
                            className={classes.caption}>
                                This week
                        </Typography>
                    </li>
                    <li className={classes.listItem}>
                        <Typography
                            variant="body2"
                            className={classes.body2}>
                                Total Rejected
                        </Typography>
                        <Typography
                            className={clsx(classes.count, classes.countNegative)}>
                            {formattedData?.rejected}
                        </Typography>
                        <Typography
                            variant="caption"
                            className={classes.caption}>
                                This week
                        </Typography>
                    </li>
                </ul>
            </div>
        </WidgetWrapper>
    );
}
