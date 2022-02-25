import { buildEmptyClassForm } from "./classes";
import { AgeRangeEdge } from "@/api/ageRanges";
import {
    useGetClassNodeAgeRangesLazy,
    useGetClassNodeConnections,
    useGetClassNodeGradesLazy,
    useGetClassNodeProgramsLazy,
    useGetClassNodeSchoolsLazy,
    useGetClassNodeSubjectsLazy,
} from "@/api/classes";
import {
    GradeEdge,
    GradeNode,
} from "@/api/grades";
import {
    AgeRangeNode,
    ProgramEdge,
    ProgramNode,
} from "@/api/programs";
import {
    SchoolEdge,
    SchoolNode,
} from "@/api/schools";
import {
    SubjectEdge,
    SubjectNode,
} from "@/api/subjects";
import { ClassForm } from "@/components/Class/Dialog/Form";
import { Status } from "@/types/graphQL";
import {
    useEffect,
    useState,
} from "react";

export const mapEdgeToIdString = (edge: SchoolEdge | ProgramEdge | GradeEdge | AgeRangeEdge | SubjectEdge): string => edge?.node?.id ?? ``;
export const mapNodeToIdString = (node: SchoolNode | ProgramNode | GradeNode | AgeRangeNode | SubjectNode): string => node?.id ?? ``;

export const useGetClassFormSelectedValues = (classId?: string) => {
    const [ classData, setClassData ] = useState<ClassForm>(buildEmptyClassForm());
    const [
        getSchools,
        {
            loading: schoolsLoading,
            data: schoolsData,
            refetch: refetchSchools,
        },
    ] = useGetClassNodeSchoolsLazy({
        notifyOnNetworkStatusChange: true,
    });

    const [
        getPrograms,
        {
            loading: programsLoading,
            data: programsData,
            refetch: refetchPrograms,
        },
    ] = useGetClassNodeProgramsLazy({
        notifyOnNetworkStatusChange: true,
    });

    const [
        getGrades,
        {
            loading: gradesLoading,
            data: gradesData,
            refetch: refetchGrades,
        },
    ] = useGetClassNodeGradesLazy({
        notifyOnNetworkStatusChange: true,
    });

    const [
        getAgeRanges,
        {
            loading: ageRangesLoading,
            data: ageRangesData,
            refetch: refetchAgeRanges,
        },
    ] = useGetClassNodeAgeRangesLazy({
        notifyOnNetworkStatusChange: true,
    });

    const [
        getSubjects,
        {
            loading: subjectsLoading,
            data: subjectsData,
            refetch: refetchSubjects,
        },
    ] = useGetClassNodeSubjectsLazy({
        notifyOnNetworkStatusChange: true,
    });

    const {
        data,
        refetch,
        loading,
    } = useGetClassNodeConnections({
        variables: {
            id: classId as string,
        },
        skip: !classId,
    });

    useEffect(() => {
        if (!data?.classNode) return;
        setClassData({
            id: data?.classNode?.id ?? ``,
            name: data?.classNode?.name ?? ``,
            status: data?.classNode?.status ?? Status.INACTIVE,
            schools: data?.classNode?.schoolsConnection?.edges.map(mapEdgeToIdString) ?? [],
            programs: data?.classNode?.programsConnection?.edges.map(mapEdgeToIdString) ?? [],
            grades: data?.classNode?.gradesConnection?.edges.map(mapEdgeToIdString) ?? [],
            ageRanges: data?.classNode?.ageRangesConnection?.edges.map(mapEdgeToIdString) ?? [],
            subjects: data?.classNode?.subjectsConnection?.edges.map(mapEdgeToIdString) ?? [],
        });

        if (data?.classNode?.schoolsConnection?.pageInfo?.hasNextPage) {
            getSchools({
                variables: {
                    id: classId as string,
                    cursor: data?.classNode?.schoolsConnection?.pageInfo.endCursor,
                },
            });
        }

        if (data?.classNode?.programsConnection?.pageInfo?.hasNextPage) {
            getPrograms({
                variables: {
                    id: classId as string,
                    cursor: data?.classNode?.programsConnection?.pageInfo.endCursor,
                },
            });
        }

        if (data?.classNode?.gradesConnection?.pageInfo?.hasNextPage) {
            getGrades({
                variables: {
                    id: classId as string,
                    cursor: data?.classNode?.gradesConnection?.pageInfo.endCursor,
                },
            });
        }

        if (data?.classNode?.ageRangesConnection?.pageInfo?.hasNextPage) {
            getAgeRanges({
                variables: {
                    id: classId as string,
                    cursor: data?.classNode?.ageRangesConnection?.pageInfo.endCursor,
                },
            });
        }

        if (data?.classNode?.subjectsConnection?.pageInfo?.hasNextPage) {
            getSubjects({
                variables: {
                    id: classId as string,
                    cursor: data?.classNode?.subjectsConnection?.pageInfo.endCursor,
                },
            });
        }
    }, [ data ]);

    useEffect(() => {
        const schools = [ ...classData.schools as string[], ...(schoolsData?.classNode?.schoolsConnection?.edges.map(mapEdgeToIdString) ?? []) ];

        setClassData((classData) => ({
            ...classData,
            schools: schools,
        }));

        if (schoolsData?.classNode?.schoolsConnection?.pageInfo?.hasNextPage) {
            refetchSchools?.({
                cursor: schoolsData?.classNode?.schoolsConnection?.pageInfo.endCursor,
            });
        }
    }, [ schoolsData ]);

    useEffect(() => {
        const programs = [ ...classData.programs as string[], ...(programsData?.classNode?.programsConnection?.edges.map(mapEdgeToIdString) ?? []) ];

        setClassData((classData) => ({
            ...classData,
            programs: programs,
        }));

        if (programsData?.classNode?.programsConnection?.pageInfo?.hasNextPage) {
            refetchPrograms?.({
                cursor: programsData?.classNode?.programsConnection?.pageInfo.endCursor,
            });
        }
    }, [ programsData ]);

    useEffect(() => {
        const grades = [ ...classData.grades as string[], ...(gradesData?.classNode?.gradesConnection?.edges.map(mapEdgeToIdString) ?? []) ];

        setClassData((classData) => ({
            ...classData,
            grades: grades,
        }));

        if (gradesData?.classNode?.gradesConnection?.pageInfo?.hasNextPage) {
            refetchGrades?.({
                cursor: gradesData?.classNode?.gradesConnection?.pageInfo.endCursor,
            });
        }
    }, [ gradesData ]);

    useEffect(() => {
        const ageRanges = [ ...classData.ageRanges as string[], ...(ageRangesData?.classNode?.ageRangesConnection?.edges.map(mapEdgeToIdString) ?? []) ];

        setClassData((classData) => ({
            ...classData,
            ageRanges: ageRanges,
        }));

        if (ageRangesData?.classNode?.ageRangesConnection?.pageInfo?.hasNextPage) {
            refetchAgeRanges?.({
                cursor: ageRangesData?.classNode?.ageRangesConnection?.pageInfo.endCursor,
            });
        }
    }, [ ageRangesData ]);

    useEffect(() => {
        const subjects = [ ...classData.subjects as string[], ...(subjectsData?.classNode?.subjectsConnection?.edges.map(mapEdgeToIdString) ?? []) ];

        setClassData((classData) => ({
            ...classData,
            subjects: subjects,
        }));

        if (subjectsData?.classNode?.subjectsConnection?.pageInfo?.hasNextPage) {
            refetchSubjects?.({
                cursor: subjectsData?.classNode?.subjectsConnection?.pageInfo.endCursor,
            });
        }
    }, [ subjectsData ]);

    return {
        data: classData,
        refetch,
        loading: loading || schoolsLoading
        || programsLoading
        || gradesLoading
        || ageRangesLoading
        || subjectsLoading,
    };
};
