import BarChart from "./BarChart";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import { useCurrentOrganization } from "@/state/organizationMemberships";
import { useGetStudentLearningOutcome } from "@kl-engineering/reports-api-client";
import { ParentSize } from "@visx/responsive";
import React from "react";
import { useIntl } from "react-intl";

interface Props { }
interface UniqueSkillConversionType {
    skill: string[];
    skill_name: string;
    achieved: number;
    not_achieved: number;
    total: number;
}
interface SkillTypeForGraph {
    skill: string;
    achieved: number;
    notAchieved: number;
}

export default function LearningOutcomeSummary (props: Props) {
    const intl = useIntl();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;

    const {
        data,
        isLoading: isLearingOutcomeLoading,
        error: isLearingOutcomeError,
        refetch,
    } = useGetStudentLearningOutcome({
        org: organizationId,
    });

    const learningOutComeData: SkillTypeForGraph[] = data?.info?.skills?.reduce((skills: UniqueSkillConversionType[], responseSkill) => {
        const index = skills.findIndex(skill => skill.skill_name === responseSkill.skill_name);
        if (index !== -1) {
            const {
                skill_name,
                not_achieved,
                achieved,
                total,
                skill,
            } = skills[index];
            skills[index] = {
                skill_name,
                achieved: achieved + responseSkill.achieved,
                not_achieved: not_achieved + responseSkill.not_achieved,
                total: total + responseSkill.total,
                skill: [ ...skill, responseSkill.skill ],
            };
            return skills;
        }
        return [
            ...skills,
            {
                ...responseSkill,
                skill: [ responseSkill.skill ],
            },
        ];
    }, [])
        .sort((previous, current) => current.total - previous.total)
        .slice(0, 5)
        .map((s) => ({
            skill: s.skill_name,
            achieved: s.achieved,
            notAchieved: s.not_achieved,
        })) || [];

    return (
        <WidgetWrapper
            loading={isLearingOutcomeLoading}
            error={isLearingOutcomeError}
            noData={!data?.successful}
            reload={refetch}
            label={intl.formatMessage({
                id: `home.student.learningOutcomeWidget.containerTitleLabel`,
            })}
            link={{
                url: `reports`,
                label: intl.formatMessage({
                    id: `home.student.learningOutcomeWidget.containerUrlLabel`,
                }),
            }}
            id={WidgetType.LEARNINGOUTCOME}
        >
            <ParentSize>
                {({ width, height }) => (
                    <BarChart
                        data={learningOutComeData}
                        width={width}
                        height={height}
                    />
                )}
            </ParentSize>
        </WidgetWrapper>
    );
}
