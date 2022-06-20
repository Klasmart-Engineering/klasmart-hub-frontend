import LoadingPage from "@/components/Common/LoadingPage";
import React,
{ Suspense, useContext } from "react";
import WidgetContext from "../../WidgetManagement/widgetCustomisation/widgetContext";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const PendingAssessments = React.lazy(() => import(`reports/PendingAssessments`));

const PendingAssessmentsWidget: React.FC = () => {
    return (
        <Suspense
            fallback={(
                <LoadingPage />
            )}
        >
            <PendingAssessments widgetContext={useContext(WidgetContext)} />
        </Suspense>
    );
}

export default PendingAssessmentsWidget;