import LoadingPage from "@/components/Common/LoadingPage";
import { tabTitle } from "@/utils/tabTitle";
import React,
{ Suspense } from "react";

interface Props {
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const SchedulePageMFE = React.lazy(() => import(`schedule/Schedule`));

export default function SchedulePage (props: Props) {
    tabTitle(`Schedule`);

    return (
        <Suspense
            fallback={(
                <LoadingPage />
            )}
        >
            <SchedulePageMFE />
        </Suspense>
    );
}
