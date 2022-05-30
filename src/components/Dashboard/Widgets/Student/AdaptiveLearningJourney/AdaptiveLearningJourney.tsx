import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import React from "react";
import { useIntl } from "react-intl";

interface Props { }

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const AdaptiveLearningJourneyWidget = React.lazy(() => import(`reports/AdaptiveLearningJourneyWidget`));

function AdaptiveLearningJourney (props: Props) {
    const intl = useIntl();

    return (
        <WidgetWrapper
            noBackground
            editable={false}
            error={false}
            loading={false}
            noData={false}
            reload={() => { false; }}
            label={
                intl.formatMessage({
                    id: `home.student.adaptiveLearningJourney.containerTitleLabel`,
                })
            }
            /*link={{
                url: ``,
                label: intl.formatMessage({
                    id: `home.student.adaptiveLearningWidget.containerUrlLabel`,
                }),
            }}*/
            id={WidgetType.ADAPTIVELEARNINGJOURNEY}
        >
            <AdaptiveLearningJourneyWidget />
        </WidgetWrapper>
    );
}

export default AdaptiveLearningJourney;
