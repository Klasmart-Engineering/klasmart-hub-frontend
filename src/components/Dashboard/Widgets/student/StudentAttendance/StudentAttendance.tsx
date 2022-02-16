
import XYLineChart from "./XYLineChart";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { PRIMARY_THEME_COLOR } from "@/themeProvider";
import { CalendarTodayOutlined } from '@mui/icons-material';
import {
    Box,
    Theme,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { ParentSize } from "@visx/responsive";
import { utils } from "kidsloop-px";
import React from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme:Theme) => createStyles({
    widgetContent: {
        display: `grid`,
        gridTemplateColumns: `1fr`,
        gridTemplateRows: `20% 80%`,
        width: `100%`,
        height: `100%`,
    },
    banner: {
        borderRadius: 15,
        backgroundColor: theme.palette.primary.light,
        padding: theme.spacing(3, 4),
        display: `flex`,
        flexDirection: `row`,
        justifyContent: `space-between`,
        alignItems: `center`,
        "& .bannerLeft":{
            display: `flex`,
            flexDirection: `row`,
            justifyContent: `flex-start`,
            alignItems: `center`,
            "& *":{
                marginRight: 10,
            },
        },
    },
}));

interface Props {
}

export default function StudentAttendanceWidget (props: Props) {
    const intl = useIntl();
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;
    const organizationName = currentOrganization?.organization_name ?? ``;
    const organizationPrimaryColor = currentOrganization?.branding?.primaryColor ?? (organizationName ? utils.stringToColor(organizationName) : PRIMARY_THEME_COLOR);

    const data = [
        {
            x: `2020-01-18`,
            y: 0.7,
        },
        {
            x: `2020-01-19`,
            y: 0.05,
        },
        {
            x: `2020-01-20`,
            y: 0.70,
        },
        {
            x: `2020-01-21`,
            y: 0.85,
        },
        {
            x: `2020-01-22`,
            y: 0.75,
        },
        {
            x: `2020-01-23`,
            y: 0.85,
        },
        {
            x: `2020-01-24`,
            y: 0.80,
        },
        {
            x: `2020-01-25`,
            y: 0.60,
        },
    ];

    return (
        <WidgetWrapper
            id={WidgetType.ATTENDANCERATE}
            loading={false}
            error={undefined}
            noData={false}
            reload={()=>{return;}}
            label={
                intl.formatMessage({
                    id: `home.student.attendanceWidget.containerTitleLabel`,
                })
            }
            link={{
                url: `assessments`,
                label: intl.formatMessage({
                    id: `home.student.attendanceWidget.containerUrlLabel`,
                }),
            }}>
            <Box className={classes.widgetContent}>
                <Box className={classes.banner}>
                    <div className="bannerLeft">
                        <CalendarTodayOutlined
                            fontSize="large"
                            color="primary"
                        >
                        </CalendarTodayOutlined>
                        <div>
                            <Typography variant="body1">
                                <FormattedMessage id="home.student.attendanceWidget.legend"></FormattedMessage>
                            </Typography>
                        </div>
                    </div>
                    <div>
                        <Typography
                            variant="h5"
                            color="primary">
                            86%
                        </Typography>
                    </div>
                </Box>
                <Box>
                    <ParentSize>
                        {({ width, height }) => (
                            <XYLineChart
                                data={data}
                                width={width}
                                height={height}
                                color={organizationPrimaryColor}
                            />
                        )}
                    </ParentSize>
                </Box>
            </Box>
        </WidgetWrapper>
    );
}
