import { WidgetType } from "../../models/widget.model";
import LoadingPage from "@/components/Common/LoadingPage";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import React,
{ Suspense } from "react";
import { useIntl } from "react-intl";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const AttendanceRate = React.lazy(() => import(`reports/AttendanceRate`));

export default function AttendanceRateWidget () {
    const intl = useIntl();

    return (
        <WidgetWrapper
            loading={false}
            error={false}
            noData={false}
            // reload={refetch}
            label={
                intl.formatMessage({
                    id: `home.attendance.containerTitleLabel`,
                })
            }
            /*link={{
                url: `reports`,
                label: intl.formatMessage({
                    id: `home.attendance.containerUrlLabel`,
                }),
            }}*/
            id={WidgetType.ATTENDANCERATE}
        >
            <Suspense
                fallback={(
                    <LoadingPage />
                )}
            >
                <AttendanceRate />
            </Suspense>
        </WidgetWrapper>
    );
}
