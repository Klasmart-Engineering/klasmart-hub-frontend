import { WidgetType } from "../../models/widget.model";
import LoadingPage from "@/components/Common/LoadingPage";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import React,
{ Suspense } from "react";
import { useIntl } from "react-intl";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const PendingAssessments = React.lazy(() => import(`reports/PendingAssessments`));

export default function PendingAssessmentsWidget () {
    const intl = useIntl();

    return (
        <WidgetWrapper
            label={
                intl.formatMessage({
                    id: `home.pendingAssessments.containerTitleLabel`,
                })
            }
            link={{
                url: `assessments`,
                label: intl.formatMessage({
                    id: `home.pendingAssessments.containerUrlLabel`,
                }),
            }}
            id={WidgetType.PENDINGASSESSMENTS}
        >
            <Suspense
                fallback={(
                    <LoadingPage />
                )}
            >
                <PendingAssessments />
            </Suspense>
        </WidgetWrapper>
    );
}
