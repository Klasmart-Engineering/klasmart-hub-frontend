import { mapAgeRangesToFilter } from "./ageRanges";
import { mapGradeEdgesToFilterOptions } from "./grades";
import { useGetPaginatedAgeRangesList } from "@/api/ageRanges";
import { useGetPaginatedOrganizationGradesList } from "@/api/grades";
import {
    NON_SPECIFIED,
    Status,
} from "@/types/graphQL";
import { FilterValueOption } from "kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import {
    useEffect,
    useState,
} from "react";

export const useGetProgramFormDropdowns = () => {
    const [ nonSpecifiedAgeRange, setNonSpecifiedAgeRange ] = useState<FilterValueOption>();
    const [ systemAgeRanges, setSystemAgeRanges ] = useState<FilterValueOption[]>([]);
    const [ customAgeRanges, setCustomAgeRanges ] = useState<FilterValueOption[]>([]);
    const [ nonSpecifiedGrade, setNonSpecifiedGrade ] = useState<FilterValueOption>();
    const [ systemGrades, setSystemGrades ] = useState<FilterValueOption[]>([]);
    const [ customGrades, setCustomGrades ] = useState<FilterValueOption[]>([]);

    const {
        data: gradesData,
        loading: gradesLoading,
        fetchMore: fetchMoreGrades,
    } = useGetPaginatedOrganizationGradesList({
        variables: {
            direction: `FORWARD`,
            count: 50,
            orderBy: `name`,
            order: `ASC`,
            filter: {
                status: {
                    operator: `eq`,
                    value: Status.ACTIVE,
                },
            },
        },
        returnPartialData: true,
        fetchPolicy: `no-cache`,
    });

    const {
        data: ageRangesData,
        loading: ageRangesLoading,
        fetchMore: fetchMoreAgeRanges,
    } = useGetPaginatedAgeRangesList({
        variables: {
            direction: `FORWARD`,
            count: 50,
            orderBy: [ `lowValueUnit`, `lowValue` ],
            order: `ASC`,
            filter: {
                status: {
                    operator: `eq`,
                    value: Status.ACTIVE,
                },
            },
        },
        returnPartialData: true,
        fetchPolicy: `no-cache`,
    });

    useEffect(() => {
        const system = gradesData?.gradesConnection?.edges.filter(edge => edge.node.system && edge?.node?.name !== NON_SPECIFIED) ?? [];
        const custom = gradesData?.gradesConnection?.edges.filter(edge => !edge.node.system) ?? [];

        if (!gradesData?.gradesConnection?.pageInfo?.hasPreviousPage) {
            const nonSpec = gradesData?.gradesConnection?.edges.find(edge => edge?.node.name === NON_SPECIFIED);
            if (nonSpec) setNonSpecifiedGrade({
                label: nonSpec.node.name,
                value: nonSpec.node.id,
            });
            setSystemGrades(mapGradeEdgesToFilterOptions(system ?? []));
            setCustomGrades(mapGradeEdgesToFilterOptions(custom ?? []));
        } else {
            setSystemGrades([ ...systemGrades, ...mapGradeEdgesToFilterOptions(system) ]);
            setCustomGrades([ ...customGrades, ...mapGradeEdgesToFilterOptions(custom) ]);
        }

        if (gradesData?.gradesConnection?.pageInfo?.hasNextPage) {
            fetchMoreGrades({
                variables: {
                    cursor: gradesData?.gradesConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ gradesData ]);

    useEffect(() => {
        const system = ageRangesData?.ageRangesConnection?.edges.filter(edge => edge?.node?.system && edge?.node?.name !== NON_SPECIFIED) ?? [];
        const custom = ageRangesData?.ageRangesConnection?.edges.filter(edge => !edge?.node?.system) ?? [];

        if (!ageRangesData?.ageRangesConnection?.pageInfo?.hasPreviousPage) {
            const nonSpec = ageRangesData?.ageRangesConnection?.edges.find(edge => edge?.node?.name === NON_SPECIFIED && edge?.node?.system);
            if (nonSpec) setNonSpecifiedAgeRange({
                label: nonSpec?.node?.name ?? ``,
                value: nonSpec?.node?.id ?? ``,
            });
            setSystemAgeRanges(mapAgeRangesToFilter(system ?? []));
            setCustomAgeRanges(mapAgeRangesToFilter(custom ?? []));
        } else {
            setSystemAgeRanges([ ...systemAgeRanges, ...mapAgeRangesToFilter(system) ]);
            setCustomAgeRanges([ ...customAgeRanges, ...mapAgeRangesToFilter(custom) ]);
        }

        if (ageRangesData?.ageRangesConnection?.pageInfo?.hasNextPage) {
            fetchMoreAgeRanges({
                variables: {
                    cursor: ageRangesData?.ageRangesConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ ageRangesData ]);

    return {
        customGrades,
        systemGrades,
        nonSpecifiedGrade,
        gradesLoading,
        customAgeRanges,
        systemAgeRanges,
        nonSpecifiedAgeRange,
        ageRangesLoading,
    };
};
