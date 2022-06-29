
import LoadingPage from "@/components/Common/LoadingPage";
import React,
{ Suspense } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const ReportPageMFE = React.lazy(() => import(`cms/report`));

export default function ReportsPage () {

    return (
        <Suspense
            fallback={(
                <LoadingPage />
            )}
        >
            <ReportPageMFE />
        </Suspense>
    );
}