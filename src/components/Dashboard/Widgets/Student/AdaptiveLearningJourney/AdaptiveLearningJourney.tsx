import LoadingPage from "@/components/Common/LoadingPage";
import WidgetContext from "@/components/Dashboard/WidgetManagement/widgetCustomisation/widgetContext";
import React,
{ Suspense, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const AdaptiveLearningJourney = React.lazy(() => import(`reports/AdaptiveLearningJourneyWidget`));

const AdaptiveLearningJourneyWidget: React.FC = () => {
    return (
        <Suspense
            fallback={(
                <LoadingPage />
            )}
        >
            <AdaptiveLearningJourney widgetContext={useContext(WidgetContext)}/>
        </Suspense>
    );
}

export default AdaptiveLearningJourneyWidget;
