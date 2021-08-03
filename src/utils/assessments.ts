import { ScheduleServerType } from "@/api/restapi";
import { AssessmentStatus } from "@/types/objectTypes";
import { SubgroupTab } from "kidsloop-px/dist/types/components/Table/Common/GroupTabs";
import { IntlShape } from "react-intl";

export const getStatusLabel = (status: AssessmentStatus, intl: IntlShape) => {
    switch (status) {
    case AssessmentStatus.COMPLETE:
        return intl.formatMessage({
            id: `assessmentStatus_complete`,
        });
    case AssessmentStatus.IN_PROGRESS:
        return intl.formatMessage({
            id: `assessmentStatus_inProgress`,
        });
    default:
        return status;
    }
};

export const buildDefaultAssessmentStatusTabs = (intl: IntlShape): SubgroupTab[] => ([
    {
        text: getStatusLabel(AssessmentStatus.COMPLETE, intl),
        value: AssessmentStatus.COMPLETE,
        count: 0,
    },
    {
        text: getStatusLabel(AssessmentStatus.IN_PROGRESS, intl),
        value: AssessmentStatus.IN_PROGRESS,
        count: 0,
    },
]);

export type ScheduleClientType = `class` | `live` | `study` | `home_fun_study`

export const mapAssessmentScheduleServerToClientType = (type: ScheduleServerType): ScheduleClientType => {
    switch (type) {
    case `OfflineClass`: return `class`;
    case `OnlineClass`: return `live`;
    case `Homework`: return `study`;
    case `IsHomeFun`: return `home_fun_study`;
    }
};
