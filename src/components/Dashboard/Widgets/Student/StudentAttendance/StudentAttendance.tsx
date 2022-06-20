import LoadingPage from "@/components/Common/LoadingPage";
import WidgetContext from "@/components/Dashboard/WidgetManagement/widgetCustomisation/widgetContext";
import React,
{ Suspense, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const StudentAttendance = React.lazy(() => import(`reports/StudentAttendance`));

const StudentAttendanceWidget: React.FC = () => {
    return (
        <Suspense
            fallback={(
                <LoadingPage />
            )}
        >
            <StudentAttendance widgetContext={useContext(WidgetContext)}/>
        </Suspense>
    );
}

export default StudentAttendanceWidget;
