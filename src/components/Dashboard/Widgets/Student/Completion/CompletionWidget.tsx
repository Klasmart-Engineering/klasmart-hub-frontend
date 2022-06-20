import LoadingPage from "@/components/Common/LoadingPage";
import WidgetContext from "@/components/Dashboard/WidgetManagement/widgetCustomisation/widgetContext";
import React,
{ Suspense, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const Completion = React.lazy(() => import(`reports/CompletionWidget`));

const CompletionWidget: React.FC = () => {
    return (
        <Suspense
            fallback={(
                <LoadingPage />
            )}
        >
            <Completion widgetContext={useContext(WidgetContext)} />
        </Suspense>
    );
}

export default CompletionWidget;
