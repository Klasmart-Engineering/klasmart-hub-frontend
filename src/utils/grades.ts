import {
    GradeEdge,
    useGetPaginatedOrganizationGradesList,
} from "@/api/grades";
import { buildGradeFilter } from "@/operations/queries/getOrganizationGrades";
import {
    Grade,
    Program,
    Status,
} from "@/types/graphQL";
import { FilterValueOption } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import {
    isEqual,
    pickBy,
} from "lodash";
import {
    useEffect,
    useState,
} from "react";

export const buildEmptyGrade = (grade?: Grade): Grade =>
    pickBy<Grade>({
        id: grade?.id,
        name: grade?.name,
        status: grade?.status ?? Status.ACTIVE,
        system: grade?.system ?? false,
        progress_from_grade: grade?.progress_from_grade,
        progress_to_grade: grade?.progress_to_grade,
    }, (value) => value !== undefined);

export const sortGradeNames = (a: string, b: string, locale?: string, collatorOptions?: Intl.CollatorOptions) => a.localeCompare(b, locale, collatorOptions);

export const mapGradeEdgesToFilterOptions = (edges: GradeEdge[]) =>
    edges.map((edge) => ({
        value: edge.node.id,
        label: edge.node.name,
    }));

export const mapGradesFromPrograms = (programs: Program[]): Grade[] => {
    const grades = programs.filter(program => program.grades?.length).flatMap(program => program.grades)
        .filter((grade, i, array) => (i === array.findIndex(foundFilter => isEqual(foundFilter, grade))));

    return grades as Grade[] ?? [];
};

export const useGradeFilters = (orgId: string, skip?: boolean) => {
    const [ gradeFilterValueOptions, setGradeFilterValueOptions ] = useState<FilterValueOption[]>([]);
    const filter = buildGradeFilter({
        organizationId: orgId ?? ``,
        search: ``,
        filters: [],
    });
    const { data: gradesData, fetchMore: fetchMoreGrades } =
    useGetPaginatedOrganizationGradesList({
        variables: {
            direction: `FORWARD`,
            count: 50,
            orderBy: `name`,
            order: `ASC`,
            filter,
        },
        returnPartialData: true,
        fetchPolicy: `no-cache`,
        skip: !orgId || skip,
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

    return {
        gradeFilterValueOptions,
    };
};
