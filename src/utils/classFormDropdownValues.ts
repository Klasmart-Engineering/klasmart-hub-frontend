import { mapAcademicTermEdgesToFilterValues } from "./academicTerms";
import { mapAgeRangesToFilter } from "./ageRanges";
import { mapGradeEdgesToFilterOptions } from "./grades";
import { mapProgramEdgesToFilterValues } from "./programs";
import { mapSchoolEdgesToFilterValues } from "./schools";
import { buildProgramIdFilter } from "./sharedFilters";
import { mapSubjectEdgesToFilterValueOptions } from "./subjects";
import { useGetPaginatedAcademicTerms } from "@/api/academicTerms";
import { useGetPaginatedAgeRangesList } from "@/api/ageRanges";
import { useGetPaginatedOrganizationGradesList } from "@/api/grades";
import { useGetAllPaginatedPrograms } from "@/api/programs";
import { useGetPaginatedSchools } from "@/api/schools";
import { useGetAllPaginatedSubjects } from "@/api/subjects";
import { buildSchoolIdFilter } from "@/operations/queries/getPaginatedOrganizationPrograms";
import { Status } from "@/types/graphQL";
import { FilterValueOption } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Filter/Filters";
import {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

export const useGetClassFormValues = (programIds: string[], schoolIds: string[]) => {
    const [ gradeValueOptions, setGradeValueOptions ] = useState<FilterValueOption[]>([]);
    const [ subjectValueOptions, setSubjectValueOptions ] = useState<FilterValueOption[]>([]);
    const [ ageRangeValueOptions, setAgeRangeValueOptions ] = useState<FilterValueOption[]>([]);
    const [ programValueOptions, setProgramValueOptions ] = useState<FilterValueOption[]>([]);
    const [ schoolValueOptions, setSchoolValueOptions ] = useState<FilterValueOption[]>([]);
    const [ academicTermsValueOptions, setAcademicTermsValueOptions ] = useState<FilterValueOption[]>([]);
    const [ singleSchoolId, setSingleSchoolId ] = useState<string>();

    const intl = useIntl();

    const {
        data: gradesData,
        loading: gradesLoading,
        refetch: refetchGrades,
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
        refetch: refetchSubjects,
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
        refetch: refetchAgeRanges,
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
        refetch: refetchSchools,
    } = useGetPaginatedSchools({
        variables: {
            direction: `FORWARD`,
            orderBy: `name`,
            order: `ASC`,
            count: 50,
            filter: {
                status: {
                    operator: `eq`,
                    value: Status.ACTIVE,
                },
            },
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: `no-cache`,
    });

    const {
        loading: academicTermsLoading,
        data: academicTermData,
        refetch: refetchAcademicTerms,
    } = useGetPaginatedAcademicTerms({
        variables: {
            id: singleSchoolId,
            direction: `FORWARD`,
            orderBy: `name`,
            order: `ASC`,
            count: 50,
            filter: {
                status: {
                    operator: `eq`,
                    value: Status.ACTIVE,
                },
            },
        },
        skip: !singleSchoolId,
        fetchPolicy: `no-cache`,
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        if (schoolIds?.length === 1){
            setSingleSchoolId(schoolIds[0]);
        }
    }, [ schoolIds ]);

    useEffect(() => {
        if (!gradesData?.gradesConnection?.pageInfo?.hasPreviousPage && !gradesLoading) {
            setGradeValueOptions(mapGradeEdgesToFilterOptions(gradesData?.gradesConnection?.edges ?? []));
        } else if (gradesData?.gradesConnection?.pageInfo?.hasPreviousPage) {
            setGradeValueOptions((values) => ([ ...values, ...mapGradeEdgesToFilterOptions(gradesData?.gradesConnection?.edges ?? []) ]));
        }

        if (gradesData?.gradesConnection?.pageInfo?.hasNextPage) {
            refetchGrades({
                cursor: gradesData?.gradesConnection?.pageInfo?.endCursor ?? ``,
            });
        }
    }, [
        gradesData,
        setGradeValueOptions,
        refetchGrades,
        gradesLoading,
    ]);

    useEffect(() => {
        if (!subjectsData?.subjectsConnection?.pageInfo?.hasPreviousPage && !subjectsLoading) {
            setSubjectValueOptions(mapSubjectEdgesToFilterValueOptions(subjectsData?.subjectsConnection?.edges ?? []));
        } else if (subjectsData?.subjectsConnection?.pageInfo?.hasPreviousPage) {
            setSubjectValueOptions((values) => ([ ...values, ...mapSubjectEdgesToFilterValueOptions(subjectsData?.subjectsConnection?.edges ?? []) ]));
        }

        if (subjectsData?.subjectsConnection?.pageInfo?.hasNextPage) {
            refetchSubjects({
                cursor: subjectsData?.subjectsConnection?.pageInfo?.endCursor ?? ``,
            });
        }
    }, [
        subjectsData,
        setSubjectValueOptions,
        refetchSubjects,
        subjectsLoading,
    ]);

    useEffect(() => {
        if (!ageRangesData?.ageRangesConnection?.pageInfo?.hasPreviousPage && !ageRangesLoading) {
            setAgeRangeValueOptions(mapAgeRangesToFilter(ageRangesData?.ageRangesConnection?.edges ?? []));
        } else if (ageRangesData?.ageRangesConnection?.pageInfo?.hasPreviousPage) {
            setAgeRangeValueOptions((values) => ([ ...values, ...mapAgeRangesToFilter(ageRangesData?.ageRangesConnection?.edges ?? []) ]));
        }

        if (ageRangesData?.ageRangesConnection?.pageInfo?.hasNextPage) {
            refetchAgeRanges({
                cursor: ageRangesData?.ageRangesConnection?.pageInfo?.endCursor ?? ``,
            });
        }
    }, [
        ageRangesData,
        setAgeRangeValueOptions,
        refetchAgeRanges,
        ageRangesLoading,
    ]);

    useEffect(() => {
        if (!programsData?.programsConnection?.pageInfo?.hasPreviousPage && !programsLoading) {
            setProgramValueOptions(mapProgramEdgesToFilterValues(programsData?.programsConnection?.edges ?? []));
        } else if (programsData?.programsConnection?.pageInfo?.hasPreviousPage) {
            setProgramValueOptions((values) => ([ ...values, ...mapProgramEdgesToFilterValues(programsData?.programsConnection?.edges ?? []) ]));
        }

        if (programsData?.programsConnection?.pageInfo?.hasNextPage) {
            refetchPrograms({
                cursor: programsData?.programsConnection?.pageInfo?.endCursor ?? ``,
            });
        }
    }, [
        programsData,
        setProgramValueOptions,
        refetchPrograms,
        programsLoading,
    ]);

    useEffect(() => {
        if (!schoolsData?.schoolsConnection?.pageInfo?.hasPreviousPage && !schoolsLoading) {
            setSchoolValueOptions(mapSchoolEdgesToFilterValues(schoolsData?.schoolsConnection?.edges ?? []));
        } else {
            setSchoolValueOptions((values) => ([ ...values, ...mapSchoolEdgesToFilterValues(schoolsData?.schoolsConnection?.edges ?? []) ]));
        }

        if (schoolsData?.schoolsConnection?.pageInfo?.hasNextPage) {
            refetchSchools({
                cursor: schoolsData?.schoolsConnection?.pageInfo?.endCursor ?? ``,
            });
        }
    }, [
        schoolsData,
        setSchoolValueOptions,
        refetchSchools,
        schoolsLoading,
    ]);

    useEffect(() => {
        if (!academicTermData?.schoolNode?.academicTermsConnection?.pageInfo?.hasPreviousPage && !academicTermsLoading) {
            setAcademicTermsValueOptions(mapAcademicTermEdgesToFilterValues(academicTermData?.schoolNode?.academicTermsConnection?.edges ?? [], intl));
        } else {
            setAcademicTermsValueOptions((values) => ([ ...values, ...mapAcademicTermEdgesToFilterValues(academicTermData?.schoolNode?.academicTermsConnection?.edges ?? [], intl) ]));
        }

        if (academicTermData?.schoolNode?.academicTermsConnection?.pageInfo?.hasNextPage) {
            refetchAcademicTerms({
                cursor: academicTermData?.schoolNode?.academicTermsConnection?.pageInfo?.endCursor ?? ``,
            });
        }
    }, [
        academicTermData,
        setAcademicTermsValueOptions,
        refetchAcademicTerms,
        academicTermsLoading,
    ]);

    return {
        gradeValueOptions,
        subjectValueOptions,
        ageRangeValueOptions,
        programValueOptions,
        schoolValueOptions,
        academicTermsValueOptions,
        gradesLoading,
        subjectsLoading,
        ageRangesLoading,
        programsLoading,
        schoolsLoading,
        refetchPrograms,
        academicTermsLoading,
    };
};
