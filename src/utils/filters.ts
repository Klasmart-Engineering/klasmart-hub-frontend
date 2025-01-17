import {
    mapAgeRangesHighValueToFilter,
    mapAgeRangesLowValueToFilter,
} from "./ageRanges";
import { mapCategoriesToFilterOptions } from "./categories";
import {
    mapAcademicTerm,
    mapClassEdgesToFilterValues,
} from "./classes";
import { mapGradeEdgesToFilterOptions } from "./grades";
import { mapProgramEdgesToFilterValues } from "./programs";
import { mapSchoolEdgesToFilterValues } from "./schools";
import { mapSubjectEdgesToFilterValueOptions } from "./subjects";
import { mapUserRolesToFilterValueOptions } from "./users";
import { useGetPaginatedAcademicTerms } from "@/api/academicTerms";
import { useGetPaginatedAgeRangesList } from "@/api/ageRanges";
import { useGetAllCategories } from "@/api/categories";
import { useGetAllPaginatedClasses } from "@/api/classes";
import { useGetPaginatedOrganizationGradesList } from "@/api/grades";
import { useGetAllPaginatedProgramsList } from "@/api/programs";
import { useGetPaginatedOrganizationRoles } from "@/api/roles";
import { useGetPaginatedSchools } from "@/api/schools";
import { useGetAllPaginatedSubjects } from "@/api/subjects";
import { buildGradeFilter } from "@/operations/queries/getOrganizationGrades";
import { buildOrganizationAgeRangeFilter } from "@/operations/queries/getPaginatedAgeRanges";
import { buildOrganizationClassesFilter } from "@/operations/queries/getPaginatedOrganizationClasses";
import { buildOrganizationProgramFilter } from "@/operations/queries/getPaginatedOrganizationPrograms";
import { buildOrganizationRoleFilter } from "@/operations/queries/getPaginatedOrganizationRoles";
import { buildOrganizationSchoolFilter } from "@/operations/queries/getPaginatedOrganizationSchools";
import { buildOrganizationSubjectFilter } from "@/operations/queries/getPaginatedOrganizationSubjects";
import { FilterValueOption } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Filter/Filters";
import {
    useEffect,
    useState,
} from "react";

interface SelectFilters {
    queryGrades?: boolean;
    querySubjects?: boolean;
    queryAgeRanges?: boolean;
    querySchools?: boolean;
    queryClass?: boolean;
    queryPrograms?: boolean;
    queryUserRoles?: boolean;
    queryCategories?: boolean;
    queryAcademicTerm?: { schoolId: string };
}

export const useGetTableFilters = (orgId: string, selectedFilters: SelectFilters, skipAll?: boolean) => {
    const [ gradeFilterValueOptions, setGradeFilterValueOptions ] = useState<FilterValueOption[]>([]);
    const [ subjectFilterValueOptions, setSubjectFilterValueOptions ] = useState<FilterValueOption[]>([]);
    const [ ageRangesLowValueOptions, setAgeRangesLowValueOptions ] = useState<FilterValueOption[]>([]);
    const [ ageRangesHighValueOptions, setAgeRangesHighValueOptions ] = useState<FilterValueOption[]>([]);
    const [ schoolsFilterValueOptions, setSchoolsFilterValueOptions ] = useState<FilterValueOption[]>([]);
    const [ classFilterValueOptions, setClassFilterValueOptions ] = useState<FilterValueOption[]>([]);
    const [ programsFilterValueOptions, setProgramsFilterValueOptions ] = useState<FilterValueOption[]>([]);
    const [ userRolesFilterValueOptions, setUserRolesFilterValueOptions ] = useState<FilterValueOption[]>([]);
    const [ categoriesFilterValueOptions, setCategoriesFilterValueOptions ] = useState<FilterValueOption[]>([]);
    const [ academicTermValueOptions, setAcademicTermValueOptions ] = useState<FilterValueOption[]>([]);
    const gradeFilter = buildGradeFilter({
        organizationId: orgId ?? ``,
        search: ``,
        filters: [],
    });

    const schoolPaginationFilter = buildOrganizationSchoolFilter({
        organizationId: orgId ?? ``,
        search: ``,
    });

    const classPaginationFilter = buildOrganizationClassesFilter({
        organizationId: orgId ?? ``,
        search: ``,
        filters: [],
    });

    const programPaginationFilter = buildOrganizationProgramFilter({
        organizationId: orgId ?? ``,
        search: ``,
        filters: [],
    });

    const rolesPaginationFilter = buildOrganizationRoleFilter({
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
        data: classData,
        fetchMore: fetchMoreClasses,
    } = useGetAllPaginatedClasses({
        variables: {
            direction: `FORWARD`,
            count: 50,
            order: `ASC`,
            orderBy: `name`,
            filter: classPaginationFilter,
        },
        notifyOnNetworkStatusChange: true,
        skip: !orgId || skipAll || !selectedFilters.queryClass,
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

    const {
        data: userRolesData,
        fetchMore: fetchMoreUserRoles,
    } = useGetPaginatedOrganizationRoles({
        variables: {
            direction: `FORWARD`,
            count: 50,
            order: `ASC`,
            orderBy: `name`,
            filter: rolesPaginationFilter,
        },
        skip: !orgId || skipAll || !selectedFilters.queryUserRoles,
    });

    const { data: categoriesData } = useGetAllCategories({
        variables: {
            organization_id: orgId ?? ``,
        },
        skip: !orgId || skipAll || !selectedFilters.queryCategories,
    });

    const shouldReset = (hasPreviousPage: boolean, hasNoPreviousData: boolean) => {
        return hasPreviousPage && hasNoPreviousData;
    };

    useEffect(() => {
        setGradeFilterValueOptions((values) => ([ ...values, ...mapGradeEdgesToFilterOptions(gradesData?.gradesConnection?.edges ?? []) ]));
        if (gradesData?.gradesConnection?.pageInfo?.hasNextPage) {
            fetchMoreGrades({
                variables: {
                    cursor: gradesData?.gradesConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ gradesData, fetchMoreGrades ]);

    useEffect(() => {
        setSubjectFilterValueOptions((values) => ([ ...values, ...mapSubjectEdgesToFilterValueOptions(subjectsData?.subjectsConnection?.edges ?? []) ]));
        if (subjectsData?.subjectsConnection?.pageInfo?.hasNextPage) {
            fetchMoreSubjects({
                variables: {
                    cursor: subjectsData?.subjectsConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ subjectsData, fetchMoreSubjects ]);

    useEffect(() => {
        setAgeRangesLowValueOptions((values) => ([ ...values, ...mapAgeRangesLowValueToFilter(ageRangesData?.ageRangesConnection?.edges ?? []) ]));
        setAgeRangesHighValueOptions((values) => ([ ...values, ...mapAgeRangesHighValueToFilter(ageRangesData?.ageRangesConnection?.edges ?? []) ]));

        if (ageRangesData?.ageRangesConnection?.pageInfo?.hasNextPage) {
            fetchMoreAgeRanges({
                variables: {
                    cursor: ageRangesData?.ageRangesConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ ageRangesData, fetchMoreAgeRanges ]);

    useEffect(() => {
        const reset = shouldReset(schoolsData?.schoolsConnection?.pageInfo?.hasPreviousPage === true, !schoolsFilterValueOptions.length);
        setSchoolsFilterValueOptions((values) => (reset ? [] : [ ...values, ...mapSchoolEdgesToFilterValues(schoolsData?.schoolsConnection?.edges ?? []) ]));
        if (schoolsData?.schoolsConnection?.pageInfo?.hasNextPage || reset) {
            fetchMoreSchools({
                variables: {
                    cursor: reset ? `` : schoolsData?.schoolsConnection?.pageInfo?.endCursor,
                },
            });
        }
    }, [ schoolsData, fetchMoreSchools ]);

    useEffect(() => {
        setClassFilterValueOptions((values) => ([ ...values, ...mapClassEdgesToFilterValues(classData?.classesConnection?.edges ?? []) ]));
        if (classData?.classesConnection?.pageInfo?.hasNextPage) {
            fetchMoreClasses({
                variables: {
                    cursor: classData?.classesConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ classData, fetchMoreClasses ]);

    useEffect(() => {
        setProgramsFilterValueOptions((values) => ([ ...values, ...mapProgramEdgesToFilterValues(programsData?.programsConnection?.edges ?? []) ]));
        if (programsData?.programsConnection?.pageInfo?.hasNextPage) {
            fetchMorePrograms({
                variables: {
                    cursor: programsData?.programsConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ programsData, fetchMorePrograms ]);

    useEffect(() => {
        setUserRolesFilterValueOptions((values) => ([ ...values, ...mapUserRolesToFilterValueOptions(userRolesData?.rolesConnection?.edges ?? []) ]));
        if (userRolesData?.rolesConnection?.pageInfo?.hasNextPage) {
            fetchMoreUserRoles({
                variables: {
                    cursor: userRolesData?.rolesConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ userRolesData, fetchMoreUserRoles ]);

    useEffect(() => {
        setCategoriesFilterValueOptions(mapCategoriesToFilterOptions(categoriesData?.organization?.categories ?? []));
    }, [ categoriesData ]);

    const { data: academicTermData } = useGetPaginatedAcademicTerms({
        variables: {
            id: selectedFilters.queryAcademicTerm?.schoolId ?? ``,
            direction: `FORWARD`,
            order: `ASC`,
            orderBy: `name`,
        },
        skip: !orgId || skipAll || !selectedFilters.queryAcademicTerm?.schoolId,
    });

    useEffect(() => {
        if (academicTermData?.schoolNode) setAcademicTermValueOptions(mapAcademicTerm(academicTermData.schoolNode));
    }, [ academicTermData ]);

    return {
        gradeFilterValueOptions,
        subjectFilterValueOptions,
        ageRangesLowValueOptions,
        ageRangesHighValueOptions,
        schoolsFilterValueOptions,
        classFilterValueOptions,
        programsFilterValueOptions,
        userRolesFilterValueOptions,
        categoriesFilterValueOptions,
        academicTermValueOptions,
    };
};
