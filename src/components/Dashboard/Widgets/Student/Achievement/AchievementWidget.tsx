import LoadingPage from "@/components/Common/LoadingPage";
import WidgetContext from "@/components/Dashboard/WidgetManagement/widgetCustomisation/widgetContext";
import React,
{ Suspense, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const Achievement = React.lazy(() => import(`reports/AchievementWidget`));

const AchievementWidget: React.FC = () => {
    return (
        <Suspense
            fallback={(
                <LoadingPage />
            )}
        >
            <Achievement widgetContext={useContext(WidgetContext)}/>
        </Suspense>
    );
}

export default AchievementWidget;
