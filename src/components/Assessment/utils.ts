import { AssessmentStatus } from "@kidsloop/cms-api-client";
import { GetAssessmentsSummaryResponse } from "@kidsloop/cms-api-client/dist/api/assessment";
import {
    lighten,
    Theme,
    useTheme,
} from "@mui/material";
import { SubgroupTab } from "kidsloop-px/dist/types/components/Table/Common/GroupTabs";
import { sumBy } from "lodash";
import { useMemo } from "react";
import {
    IntlShape,
    useIntl,
} from "react-intl";

export interface AssessmentColoredStatusGroup {
    color: string;
    title: string;
    value: number;
}

export interface NumberedValue {
    value: number;
}

export const getStatusColor = (status: AssessmentStatus, theme: Theme) => {
    switch (status) {
    case `complete`: return theme.palette.primary.main;
    case `in_progress`: return lighten(theme.palette.primary.main, 0.75);
    }
};

export const getStatusLabel = (status: AssessmentStatus, intl: IntlShape) => {
    switch (status) {
    case `complete`:
        return intl.formatMessage({
            id: `assessmentStatus_complete`,
        });
    case `in_progress`:
        return intl.formatMessage({
            id: `assessmentStatus_inProgress`,
        });
    default:
        return status;
    }
};

export const buildDefaultAssessmentStatusTabs = (intl: IntlShape): SubgroupTab[] => ([
    {
        text: getStatusLabel(`complete`, intl),
        value: `complete`,
        count: 0,
    },
    {
        text: getStatusLabel(`in_progress`, intl),
        value: `in_progress`,
        count: 0,
    },
]);

export const useGetAssessmentsStatusTabs = (assessmentsSummaryData: GetAssessmentsSummaryResponse | undefined) => {
    const intl = useIntl();

    return useMemo(() => {
        const assessmentStatus: AssessmentStatus[] = [ `complete`, `in_progress` ];
        const groups: SubgroupTab[] = assessmentStatus.map((status) => ({
            text: getStatusLabel(status, intl),
            value: status,
            count: assessmentsSummaryData?.[status] ?? 0,
        }));
        return groups;
    }, [ assessmentsSummaryData ]);
};

export const useGetAllAssessmentsStatusCount = (groups: NumberedValue[]) => {
    return useMemo(() => {
        return sumBy(groups, (group) => group.value);
    }, [ groups ]);
};
