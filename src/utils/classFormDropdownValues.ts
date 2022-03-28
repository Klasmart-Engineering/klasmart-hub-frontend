import { mapAgeRangesToFilter } from "./ageRanges";
import { mapGradeEdgesToFilterOptions } from "./grades";
import { mapProgramEdgesToFilterValues } from "./programs";
import { mapSchoolEdgesToFilterValues } from "./schools";
import { buildProgramIdFilter } from "./sharedFilters";
import { mapSubjectEdgesToFilterValueOptions } from "./subjects";
import { useGetPaginatedAgeRangesList } from "@/api/ageRanges";
import { useGetPaginatedOrganizationGradesList } from "@/api/grades";
import { useGetAllPaginatedPrograms } from "@/api/programs";
import { useGetPaginatedSchools } from "@/api/schools";
import { useGetAllPaginatedSubjects } from "@/api/subjects";
import { buildSchoolIdFilter } from "@/operations/queries/getPaginatedOrganizationPrograms";
import { Status } from "@/types/graphQL";
import { FilterValueOption } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import {
    useEffect,
    useState,
} from "react";

export const useGetClassFormValues = (programIds: string[], schoolIds: string[]) => {
    const [ gradeValueOptions, setGradeValueOptions ] = useState<FilterValueOption[]>([]);
    const [ subjectValueOptions, setSubjectValueOptions ] = useState<FilterValueOption[]>([]);
    const [ ageRangeValueOptions, setAgeRangeValueOptions ] = useState<FilterValueOption[]>([]);
    const [ programValueOptions, setProgramValueOptions ] = useState<FilterValueOption[]>([]);
    const [ schoolValueOptions, setSchoolValueOptions ] = useState<FilterValueOption[]>([]);
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
        fetchPolicy: `no-cache`,
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

    const {
        data: programsData,
        refetch: refetchPrograms,
        loading: programsLoading,
        fetchMore: fetchMorePrograms,
    } = useGetAllPaginatedPrograms({
        variables: {
            direction: `FORWARD`,
            count: 50,
            order: `ASC`,
            orderBy: `name`,
            filter: buildSchoolIdFilter(schoolIds),
        },
        skip: !schoolIds.length,
        notifyOnNetworkStatusChange: true,
        fetchPolicy: `no-cache`,
    });

    const {
        data: schoolsData,
        loading: schoolsLoading,
        fetchMore: fetchMoreSchools,
    } = useGetPaginatedSchools({
        fetchPolicy: `cache-first`,
        variables: {
            direction: `FORWARD`,
            count: 50,
            filter: {
                status: {
                    operator: `eq`,
                    value: Status.ACTIVE,
                },
            },
        },
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
            setAgeRangeValueOptions(mapAgeRangesToFilter(ageRangesData?.ageRangesConnection?.edges ?? []));
        } else {
            setAgeRangeValueOptions([ ...ageRangeValueOptions, ...mapAgeRangesToFilter(ageRangesData?.ageRangesConnection?.edges ?? []) ]);
        }

        if (ageRangesData?.ageRangesConnection?.pageInfo?.hasNextPage) {
            fetchMoreAgeRanges({
                variables: {
                    cursor: ageRangesData?.ageRangesConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ ageRangesData ]);

    useEffect(() => {
        if (!programsData?.programsConnection?.pageInfo?.hasPreviousPage) {
            setProgramValueOptions(mapProgramEdgesToFilterValues(programsData?.programsConnection?.edges ?? []));
        } else {
            setProgramValueOptions([ ...programValueOptions, ... mapProgramEdgesToFilterValues(programsData?.programsConnection?.edges ?? []) ]);
        }

        if (programsData?.programsConnection?.pageInfo?.hasNextPage) {
            fetchMorePrograms({
                variables: {
                    cursor: programsData?.programsConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ programsData ]);

    useEffect(() => {
        if (!schoolsData?.schoolsConnection?.pageInfo?.hasPreviousPage) {
            setSchoolValueOptions(mapSchoolEdgesToFilterValues(schoolsData?.schoolsConnection?.edges ?? []));
        } else {
            setSchoolValueOptions([ ...schoolValueOptions, ...mapSchoolEdgesToFilterValues(schoolsData?.schoolsConnection?.edges ?? []) ]);
        }

        if (schoolsData?.schoolsConnection?.pageInfo?.hasNextPage) {
            fetchMoreSchools({
                variables: {
                    cursor: schoolsData?.schoolsConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ schoolsData ]);

    return {
        gradeValueOptions,
        subjectValueOptions,
        ageRangeValueOptions,
        programValueOptions,
        schoolValueOptions,
        gradesLoading,
        subjectsLoading,
        ageRangesLoading,
        programsLoading,
        schoolsLoading,
        refetchPrograms,
    };
};
