import LoadingPage from "@/components/Common/LoadingPage";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import React,
{ Suspense } from "react";
import { useIntl } from "react-intl";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const AchievementWidgetCard = React.lazy(() => import(`reports/AchievementWidget`));

export default function AchievementWidget () {
    const intl = useIntl();

    return (
        <WidgetWrapper
            label={
                intl.formatMessage({
                    id: `home.student.achievementWidget.containerTitleLabel`,
                })
            }
            /*link={{
                url: ``,
                label: intl.formatMessage({
                    id: `home.student.achievementWidget.containerUrlLabel`,
                }),
            }}*/
            id={WidgetType.ACHIEVEMENT}
        >
            <Suspense
                fallback={(
                    <LoadingPage />
                )}
            >
                <AchievementWidgetCard />
            </Suspense>
        </WidgetWrapper>
    );
}
