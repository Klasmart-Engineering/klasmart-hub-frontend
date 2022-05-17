import LoadingPage from "@/components/Common/LoadingPage";
import { getCmsSiteEndpoint } from "@/config";
import { useFeatureFlags } from "@/feature-flag/utils";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import React,
{ Suspense } from "react";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
        height: `100%`,
    },
}));

interface Props {
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const SchedulePageMFE = React.lazy(() => import(`schedule/Schedule`));

export default function SchedulePage (props: Props) {
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;
    const { showScheduleMicroFrontend } = useFeatureFlags();

    if (showScheduleMicroFrontend) {
        return (
            <Suspense
                fallback={(
                    <LoadingPage />
                )}
            >
                <SchedulePageMFE organization_id={currentOrganization?.id} />
            </Suspense>
        );
    }

    return (
        <iframe
            src={`${getCmsSiteEndpoint()}?org_id=${organizationId}#/schedule/calendar`}
            frameBorder="0"
            className={classes.root}
        />
    );
}
