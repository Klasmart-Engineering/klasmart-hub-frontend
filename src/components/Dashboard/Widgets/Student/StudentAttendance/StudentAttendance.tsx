import LoadingPage from "@/components/Common/LoadingPage";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
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
