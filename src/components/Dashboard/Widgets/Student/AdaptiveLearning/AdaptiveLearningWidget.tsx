import LoadingPage from "@/components/Common/LoadingPage";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import React,
{ Suspense } from "react";
import { useIntl } from "react-intl";

interface Props {
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const AdaptiveLearningWidgetCard = React.lazy(() => import(`reports/AdaptiveLearningWidget`));

export default function AdaptiveLearningWidget (props: Props) {
    const intl = useIntl();

    return (
        <WidgetWrapper
            label={intl.formatMessage({
                id: `home.student.adaptiveLearningWidget.containerTitleLabel`,
            })}
            /*link={{
                url: ``,
                label: intl.formatMessage({
                    id: `home.student.adaptiveLearningWidget.containerUrlLabel`,
                }),
            }}*/
            id={WidgetType.ADAPTIVELEARNING}
        >
            <Suspense
                fallback={(
                    <LoadingPage />
                )}
            >
                <AdaptiveLearningWidgetCard />
            </Suspense>
        </WidgetWrapper>
    );
}
