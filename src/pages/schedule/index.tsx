import LoadingPage from "@/components/Common/LoadingPage";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import React,
{ Suspense } from "react";

interface Props {
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const SchedulePageMFE = React.lazy(() => import(`schedule/Schedule`));

export default function SchedulePage (props: Props) {
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;

    return (
        <Suspense
            fallback={(
                <LoadingPage />
            )}
        >
            <SchedulePageMFE organization_id={organizationId} />
        </Suspense>
    );
}
