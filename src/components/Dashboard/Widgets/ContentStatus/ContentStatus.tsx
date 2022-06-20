import LoadingPage from "@/components/Common/LoadingPage";
import React,
{ Suspense, useContext } from "react";
import WidgetContext from "../../WidgetManagement/widgetCustomisation/widgetContext";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const ContentStatus = React.lazy(() => import(`reports/ContentStatus`));

const ContentStatusWidget: React.FC = () => {
    return (
        <Suspense
            fallback={(
                <LoadingPage />
            )}
        >
            <ContentStatus widgetContext={useContext(WidgetContext)} />
        </Suspense>
    );
}

export default ContentStatusWidget;
