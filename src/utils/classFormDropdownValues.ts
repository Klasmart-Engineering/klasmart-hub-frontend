import { mapAgeRangesToFilter } from "./ageRanges";
import { mapGradeEdgesToFilterOptions } from "./grades";
import { buildProgramIdFilter } from "./sharedFilters";
import { mapSubjectEdgesToFilterValueOptions } from "./subjects";
import { useGetPaginatedAgeRangesList } from "@/api/ageRanges";
import { useGetPaginatedOrganizationGradesList } from "@/api/grades";
import { useGetAllPaginatedSubjects } from "@/api/subjects";
import { FilterValueOption } from "kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import {
    useEffect,
    useState,
} from "react";

export const useGetClassFormValues = (programIds: string[]) => {
    const [ gradeValueOptions, setGradeValueOptions ] = useState<FilterValueOption[]>([]);
    const [ subjectValueOptions, setSubjectValueOptions ] = useState<FilterValueOption[]>([]);
    const [ ageRangesValueOptions, setAgeRangesValueOptions ] = useState<FilterValueOption[]>([]);
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
            filter: buildProgramIdFilter(programIds),
        },
        returnPartialData: true,
        fetchPolicy: `no-cache`,
        skip: !programIds.length,
    });

    const {
        data: subjectsData,
        loading: subjectsLoading,
        fetchMore: fetchMoreSubjects,
    } = useGetAllPaginatedSubjects({
        variables: {
            direction: `FORWARD`,
            count: 50,
            orderBy: `name`,
            order: `ASC`,
            filter: buildProgramIdFilter(programIds),
        },
        skip: !programIds.length,
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
            filter: buildProgramIdFilter(programIds),
        },
        returnPartialData: true,
        fetchPolicy: `no-cache`,
        skip: !programIds.length,
    });

    useEffect(() => {
        if (!gradesData?.gradesConnection?.pageInfo?.hasPreviousPage) {
            setGradeValueOptions(mapGradeEdgesToFilterOptions(gradesData?.gradesConnection?.edges ?? []));
        } else {
            setGradeValueOptions([ ...gradeValueOptions, ...mapGradeEdgesToFilterOptions(gradesData?.gradesConnection?.edges ?? []) ]);
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
        if (!subjectsData?.subjectsConnection?.pageInfo?.hasPreviousPage) {
            setSubjectValueOptions(mapSubjectEdgesToFilterValueOptions(subjectsData?.subjectsConnection?.edges ?? []));
        } else {
            setSubjectValueOptions([ ...subjectValueOptions, ...mapSubjectEdgesToFilterValueOptions(subjectsData?.subjectsConnection?.edges ?? []) ]);
        }

        if (subjectsData?.subjectsConnection?.pageInfo?.hasNextPage) {
            fetchMoreSubjects({
                variables: {
                    cursor: subjectsData?.subjectsConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ subjectsData ]);

    useEffect(() => {
        if (!ageRangesData?.ageRangesConnection?.pageInfo?.hasPreviousPage) {
            setAgeRangesValueOptions(mapAgeRangesToFilter(ageRangesData?.ageRangesConnection?.edges ?? []));
        } else {
            setAgeRangesValueOptions([ ...ageRangesValueOptions, ...mapAgeRangesToFilter(ageRangesData?.ageRangesConnection?.edges ?? []) ]);
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
        gradeValueOptions,
        subjectValueOptions,
        ageRangesValueOptions,
        gradesLoading,
        subjectsLoading,
        ageRangesLoading,
    };
};
