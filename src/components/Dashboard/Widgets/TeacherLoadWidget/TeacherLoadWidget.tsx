import LoadingPage from "@/components/Common/LoadingPage";
import React,
{ Suspense, useContext } from "react";
import WidgetContext from "../../WidgetManagement/widgetCustomisation/widgetContext";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const TeacherLoad = React.lazy(() => import(`reports/TeacherLoad`));

const TeacherLoadWidget: React.FC = () => {
    return (
        <Suspense
            fallback={(
                <LoadingPage />
            )}
        >
            <TeacherLoad widgetContext={useContext(WidgetContext)} />
        </Suspense>
    );
}

export default TeacherLoadWidget;