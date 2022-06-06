import LoadingPage from "@/components/Common/LoadingPage";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { PRIMARY_THEME_COLOR } from "@/theme/utils/utils";
import { utils } from "@kl-engineering/kidsloop-px";
import { useGetStudentAttendanceRate } from "@kl-engineering/reports-api-client";
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
import React,
{ Suspense } from "react";
import { useIntl } from "react-intl";

interface Props {
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const StudentAttendanceWidgetCard = React.lazy(() => import(`reports/StudentAttendance`));

export default function StudentAttendanceWidget (props: Props) {
    const intl = useIntl();

    return (
        <WidgetWrapper
            noData={false}
            loading={false}
            error={false}
            // reload={refetch}
            label={
                intl.formatMessage({
                    id: `home.student.attendanceWidget.containerTitleLabel`,
                })
            }
            /*link={{
                url: ``,
                label: intl.formatMessage({
                    id: `home.student.attendanceWidget.containerUrlLabel`,
                }),
            }}*/
            id={WidgetType.STUDENTATTENDANCE}
        >
            <Suspense
                fallback={(
                    <LoadingPage />
                )}
            >
                <StudentAttendanceWidgetCard />
            </Suspense>
        </WidgetWrapper>
    );
}
