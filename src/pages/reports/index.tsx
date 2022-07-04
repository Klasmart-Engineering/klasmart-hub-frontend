
import LoadingPage from "@/components/Common/LoadingPage";
import React,
{ Suspense } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const CMSPageMFE = React.lazy(() => import(`cms/pages`));

export default function ReportsPage () {

    return (
        <Suspense
            fallback={(
                <LoadingPage />
            )}
        >
            <CMSPageMFE />
        </Suspense>
    );
}
