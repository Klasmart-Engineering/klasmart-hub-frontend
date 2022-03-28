import {
    mapAgeRangesHighValueToFilter,
    mapAgeRangesLowValueToFilter,
} from "./ageRanges";
import { mapCategoriesToFilterOptions } from "./categories";
import { mapGradeEdgesToFilterOptions } from "./grades";
import { mapProgramEdgesToFilterValues } from "./programs";
import { mapSchoolEdgesToFilterValues } from "./schools";
import { mapSubjectEdgesToFilterValueOptions } from "./subjects";
import { mapUserRolesToFilterValueOptions } from "./users";
import { useGetPaginatedAgeRangesList } from "@/api/ageRanges";
import { useGetAllCategories } from "@/api/categories";
import { useGetPaginatedOrganizationGradesList } from "@/api/grades";
import { useGetAllPaginatedProgramsList } from "@/api/programs";
import { useGetOrganizationRoles } from "@/api/roles";
import { useGetPaginatedSchools } from "@/api/schools";
import { useGetAllPaginatedSubjects } from "@/api/subjects";
import { buildGradeFilter } from "@/operations/queries/getOrganizationGrades";
import { buildOrganizationAgeRangeFilter } from "@/operations/queries/getPaginatedAgeRanges";
import { buildOrganizationProgramFilter } from "@/operations/queries/getPaginatedOrganizationPrograms";
import { buildOrganizationSchoolFilter } from "@/operations/queries/getPaginatedOrganizationSchools";
import { buildOrganizationSubjectFilter } from "@/operations/queries/getPaginatedOrganizationSubjects";
import { FilterValueOption } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import {
    useEffect,
    useState,
} from "react";

interface SelectFilters {
    queryGrades?: boolean;
    querySubjects?: boolean;
    queryAgeRanges?: boolean;
    querySchools?: boolean;
    queryPrograms?: boolean;
    queryUserRoles?: boolean;
    queryCategories?: boolean;
}

export const useGetTableFilters = (orgId: string, selectedFilters: SelectFilters, skipAll?: boolean) => {
    const [ gradeFilterValueOptions, setGradeFilterValueOptions ] = useState<FilterValueOption[]>([]);
    const [ subjectFilterValueOptions, setSubjectFilterValueOptions ] = useState<FilterValueOption[]>([]);
    const [ ageRangesLowValueOptions, setAgeRangesLowValueOptions ] = useState<FilterValueOption[]>([]);
    const [ ageRangesHighValueOptions, setAgeRangesHighValueOptions ] = useState<FilterValueOption[]>([]);
    const [ schoolsFilterValueOptions, setSchoolsFilterValueOptions ] = useState<FilterValueOption[]>([]);
    const [ programsFilterValueOptions, setProgramsFilterValueOptions ] = useState<FilterValueOption[]>([]);
    const [ userRolesFilterValueOptions, setUserRolesFilterValueOptions ] = useState<FilterValueOption[]>([]);
    const [ categoriesFilterValueOptions, setCategoriesFilterValueOptions ] = useState<FilterValueOption[]>([]);
    const gradeFilter = buildGradeFilter({
        organizationId: orgId ?? ``,
        search: ``,
        filters: [],
    });

    const schoolPaginationFilter = buildOrganizationSchoolFilter({
        organizationId: orgId ?? ``,
        search: ``,
    });
    const programPaginationFilter = buildOrganizationProgramFilter({
        organizationId: orgId ?? ``,
        search: ``,
        filters: [],
    });

    const {
        data: gradesData,
        fetchMore: fetchMoreGrades,
    } = useGetPaginatedOrganizationGradesList({
        variables: {
            direction: `FORWARD`,
            count: 50,
            orderBy: `name`,
            order: `ASC`,
            filter: gradeFilter,
        },
        returnPartialData: true,
        fetchPolicy: `no-cache`,
        skip: !orgId || skipAll || !selectedFilters.queryGrades,
    });

    const {
        data: subjectsData,
        fetchMore: fetchMoreSubjects,
    } = useGetAllPaginatedSubjects({
        variables: {
            direction: `FORWARD`,
            count: 50,
            orderBy: `name`,
            order: `ASC`,
            filter: buildOrganizationSubjectFilter({
                organizationId: orgId ?? ``,
                search: ``,
                filters: [],
            }),
        },
        returnPartialData: true,
        fetchPolicy: `no-cache`,
        skip: !orgId || skipAll || !selectedFilters.querySubjects,
    });

    const {
        data: ageRangesData,
        fetchMore: fetchMoreAgeRanges,
    } = useGetPaginatedAgeRangesList({
        variables: {
            direction: `FORWARD`,
            count: 50,
            orderBy: [ `lowValueUnit`, `lowValue` ],
            order: `ASC`,
            filter: buildOrganizationAgeRangeFilter({
                organizationId: orgId ?? ``,
                filters: [],
            }),
        },
        returnPartialData: true,
        fetchPolicy: `no-cache`,
        skip: !orgId || skipAll || !selectedFilters.queryAgeRanges,
    });

    const {
        data: schoolsData,
        fetchMore: fetchMoreSchools,
    } = useGetPaginatedSchools({
        variables: {
            direction: `FORWARD`,
            count: 50,
            order: `ASC`,
            orderBy: `name`,
            filter: schoolPaginationFilter,
        },
        notifyOnNetworkStatusChange: true,
        skip: !orgId || skipAll || !selectedFilters.querySchools,
    });

    const {
        data: programsData,
        fetchMore: fetchMorePrograms,
    } = useGetAllPaginatedProgramsList({
        variables: {
            direction: `FORWARD`,
            count: 50,
            orderBy: `name`,
            order: `ASC`,
            filter: programPaginationFilter,
        },
        notifyOnNetworkStatusChange: true,
        skip: !orgId || skipAll || !selectedFilters.queryPrograms,
    });

    const { data: userRolesData } = useGetOrganizationRoles({
        variables: {
            organization_id: orgId ?? ``,
        },
        skip: !orgId || skipAll || !selectedFilters.queryUserRoles,
    });

    const { data: categoriesData } = useGetAllCategories({
        variables: {
            organization_id: orgId ?? ``,
        },
        skip: !orgId || skipAll || !selectedFilters.queryCategories,
    });

    useEffect(() => {
        setGradeFilterValueOptions([ ...gradeFilterValueOptions, ...mapGradeEdgesToFilterOptions(gradesData?.gradesConnection?.edges ?? []) ]);
        if (gradesData?.gradesConnection?.pageInfo?.hasNextPage) {
            fetchMoreGrades({
                variables: {
                    cursor: gradesData?.gradesConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ gradesData ]);

    useEffect(() => {
        setSubjectFilterValueOptions([ ...subjectFilterValueOptions, ...mapSubjectEdgesToFilterValueOptions(subjectsData?.subjectsConnection?.edges ?? []) ]);
        if (subjectsData?.subjectsConnection?.pageInfo?.hasNextPage) {
            fetchMoreSubjects({
                variables: {
                    cursor: subjectsData?.subjectsConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ subjectsData ]);

    useEffect(() => {
        setAgeRangesLowValueOptions([ ...ageRangesLowValueOptions, ...mapAgeRangesLowValueToFilter(ageRangesData?.ageRangesConnection?.edges ?? []) ]);
        setAgeRangesHighValueOptions([ ...ageRangesHighValueOptions, ...mapAgeRangesHighValueToFilter(ageRangesData?.ageRangesConnection?.edges ?? []) ]);

        if (ageRangesData?.ageRangesConnection?.pageInfo?.hasNextPage) {
            fetchMoreAgeRanges({
                variables: {
                    cursor: ageRangesData?.ageRangesConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ ageRangesData ]);

    useEffect(() => {
        setSchoolsFilterValueOptions([ ...schoolsFilterValueOptions, ...mapSchoolEdgesToFilterValues(schoolsData?.schoolsConnection?.edges ?? []) ]);
        if (schoolsData?.schoolsConnection?.pageInfo?.hasNextPage) {
            fetchMoreSchools({
                variables: {
                    cursor: schoolsData?.schoolsConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ schoolsData ]);

    useEffect(() => {
        setProgramsFilterValueOptions([ ...programsFilterValueOptions, ...mapProgramEdgesToFilterValues(programsData?.programsConnection?.edges ?? []) ]);
        if (programsData?.programsConnection?.pageInfo?.hasNextPage) {
            fetchMorePrograms({
                variables: {
                    cursor: programsData?.programsConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ programsData ]);

    useEffect(() => {
        setUserRolesFilterValueOptions(mapUserRolesToFilterValueOptions(userRolesData?.organization?.roles ?? []));
    }, [ userRolesData ]);

    useEffect(() => {
        setCategoriesFilterValueOptions(mapCategoriesToFilterOptions(categoriesData?.organization?.categories ?? []));
    }, [ categoriesData ]);

    return {
        gradeFilterValueOptions,
        subjectFilterValueOptions,
        ageRangesLowValueOptions,
        ageRangesHighValueOptions,
        schoolsFilterValueOptions,
        programsFilterValueOptions,
        userRolesFilterValueOptions,
        categoriesFilterValueOptions,
    };
};
