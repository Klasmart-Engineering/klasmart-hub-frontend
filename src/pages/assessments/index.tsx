import LoadingPage from "@/components/Common/LoadingPage";
import { TabTitle } from "@/utils/tabTitle";
import React,
{ Suspense } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const AssessmentPageMFE = React.lazy(() => import(`assessment/Assessment`));

export default function AssessmentsPage () {
    TabTitle(`Kidsloop | Interactive Digital Platform for Education | Assessments`);

    return (
        <Suspense
            fallback={(
                <LoadingPage />
            )}
        >
            <AssessmentPageMFE />
        </Suspense>
    );
}
