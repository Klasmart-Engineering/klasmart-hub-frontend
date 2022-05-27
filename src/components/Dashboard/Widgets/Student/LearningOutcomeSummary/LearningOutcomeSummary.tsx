import LoadingPage from "@/components/Common/LoadingPage";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import React,
{ Suspense } from "react";
import { useIntl } from "react-intl";

interface Props { }

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const LearningOutcomeSummaryWidget = React.lazy(() => import(`reports/LearningOutcomeSummary`));

export default function LearningOutcomeSummary (props: Props) {
    const intl = useIntl();

    return (
        <WidgetWrapper
            loading={false}
            error={false}
            noData={false}
            // reload={refetch}
            label={intl.formatMessage({
                id: `home.student.learningOutcomeWidget.containerTitleLabel`,
            })}
            /*link={{
                url: ``,
                label: intl.formatMessage({
                    id: `home.student.learningOutcomeWidget.containerUrlLabel`,
                }),
            }}*/
            id={WidgetType.LEARNINGOUTCOME}
        >
            <Suspense
                fallback={(
                    <LoadingPage />
                )}
            >
                <LearningOutcomeSummaryWidget />
            </Suspense>
        </WidgetWrapper>
    );
}
