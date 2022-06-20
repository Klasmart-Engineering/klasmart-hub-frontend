import LoadingPage from "@/components/Common/LoadingPage";
import React,
{ Suspense, useContext } from "react";
import WidgetContext from "../../WidgetManagement/widgetCustomisation/widgetContext";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const AttendanceRate = React.lazy(() => import(`reports/AttendanceRate`));

const AttendanceRateWidget: React.FC = () => {
    return (
        <Suspense
            fallback={(
                <LoadingPage />
            )}
        >
            <AttendanceRate widgetContext={useContext(WidgetContext)} />
        </Suspense>
    );
}

export default AttendanceRateWidget;
