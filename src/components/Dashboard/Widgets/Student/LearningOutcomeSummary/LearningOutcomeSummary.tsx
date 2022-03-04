import BarChart from "./BarChart";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import { ParentSize } from "@visx/responsive";
import React from "react";
import { useIntl } from "react-intl";

interface Props {}

export default function LearningOutcomeSummary (props : Props) {
    const intl = useIntl();

    const formatMessage = (message : string) => (
        intl.formatMessage({
            id: `home.student.learningOutcomeWidget.${message}`,
        })
    );

    // eslint-disable-next-line no-warning-comments
    //TODO: Mock data
    const data = [
        {
            skill: formatMessage(`skill1`),
            achieved: 34,
            notAchieved: 1,
        },
        {
            skill: formatMessage(`skill2`),
            achieved: 17,
            notAchieved: 13,
        },
        {
            skill: formatMessage(`skill3`),
            achieved: 20,
            notAchieved: 7,
        },
        {
            skill: formatMessage(`skill4`),
            achieved: 12,
            notAchieved: 10,
        },
        {
            skill: formatMessage(`skill5`),
            achieved: 17,
            notAchieved: 0,
        },
    ];

    return (
        <WidgetWrapper
            loading={false}
            error={undefined}
            noData={false}
            reload={() => {
                return;
            }}
            label={intl.formatMessage({
                id: `home.student.learningOutcomeWidget.containerTitleLabel`,
            })}
            link={{
                url: ``,
                label: intl.formatMessage({
                    id: `home.student.learningOutcomeWidget.containerUrlLabel`,
                }),
            }}
            id={WidgetType.LEARNINGOUTCOME}
        >
            <ParentSize>
                {({ width, height }) => (
                    <BarChart
                        data={data}
                        width={width}
                        height={height} />
                )}
            </ParentSize>
        </WidgetWrapper>
    );
}
