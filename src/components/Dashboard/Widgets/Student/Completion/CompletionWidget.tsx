import LoadingPage from "@/components/Common/LoadingPage";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import React,
{ Suspense } from "react";
import { useIntl } from "react-intl";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const CompletionWidgetCard = React.lazy(() => import(`reports/CompletionWidget`));

export default function CompletionWidget () {
    const intl = useIntl();

    return (
        <WidgetWrapper
            label={
                intl.formatMessage({
                    id: `home.student.completionWidget.containerTitleLabel`,
                })
            }
            /*link={{
                url: ``,
                label: intl.formatMessage({
                    id: `home.student.completionWidget.containerUrlLabel`,
                }),
            }}*/
            id={WidgetType.COMPLETION}
        >
            <Suspense
                fallback={(
                    <LoadingPage />
                )}
            >
                <CompletionWidgetCard />
            </Suspense>
        </WidgetWrapper>
    );
}
