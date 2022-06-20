import LoadingPage from "@/components/Common/LoadingPage";
import WidgetContext from "@/components/Dashboard/WidgetManagement/widgetCustomisation/widgetContext";
import React,
{ Suspense, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const LearningOutcomeSummary = React.lazy(() => import(`reports/LearningOutcomeSummary`));

const LearningOutcomeSummaryWidget: React.FC = () => {
    return (
        <Suspense
            fallback={(
                <LoadingPage />
            )}
        >
            <LearningOutcomeSummary widgetContext={useContext(WidgetContext)}/>
        </Suspense>
    );
}

export default LearningOutcomeSummaryWidget;
