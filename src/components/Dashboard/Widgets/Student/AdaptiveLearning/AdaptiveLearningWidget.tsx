import LoadingPage from "@/components/Common/LoadingPage";
import WidgetContext from "@/components/Dashboard/WidgetManagement/widgetCustomisation/widgetContext";
import React,
{ Suspense, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const AdaptiveLearning = React.lazy(() => import(`reports/AdaptiveLearning`));

const AdaptiveLearningWidget: React.FC = () => {
    return (
        <Suspense
            fallback={(
                <LoadingPage />
            )}
        >
            <AdaptiveLearning widgetContext={useContext(WidgetContext)} />
        </Suspense>
    );
}

export default AdaptiveLearningWidget;
