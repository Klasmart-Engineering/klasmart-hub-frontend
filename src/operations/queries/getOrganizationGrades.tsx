import { GradeFilter } from "@/api/grades";
import { GradeRow } from "@/components/Grades/Table";
import { UuidOperator } from "@/types/graphQL";
import { isUuid } from "@/utils/pagination";
import { gql } from "@apollo/client";
import { BaseTableData } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/BaseTable";

export interface GradePaginationFilter {
    organizationId: string;
    search: string;
    filters: GradeFilter[];
}

export const buildGradeSearchFilter = (search: string): GradeFilter => ({
    ...(isUuid(search) ? {
        id: {
            operator: `eq`,
            value: search,
        },
    } : {
        OR: [
            {
                name: {
                    operator: `contains`,
                    value: search,
                    caseInsensitive: true,
                },
            },
        ],
    }),
});

export const buildGradeFilter = (filter: GradePaginationFilter): GradeFilter => ({
    status: {
        operator: `eq`,
        value: `active`,
    },
    AND: [
        {
            OR: [
                {
                    organizationId: {
                        operator: `eq`,
                        value: filter.organizationId,
                    },
                },
                {
                    system: {
                        operator: `eq`,
                        value: true,
                    },
                },
            ],
        },
        {
            AND: [ buildGradeSearchFilter(filter.search), ...filter.filters ],
        },
    ],
});

export const buildGradesFilters = (filters: BaseTableData<GradeRow>['filters'] = []): GradeFilter[] => {
    return filters.map((filter) => {
        switch (filter.columnId) {
        case `progressFrom`: {
            const values = filter.values.map((value) => {
                const progressFromIdFilter: GradeFilter = {
                    fromGradeId: {
                        operator: filter.operatorValue as UuidOperator,
                        value,
                    },
                };
                return progressFromIdFilter;
            });

            return {
                OR: values,
            };
        }
        case `progressTo`: {
            const values = filter.values.map((value) => {
                const progressToIdFilter: GradeFilter = {
                    toGradeId: {
                        operator: filter.operatorValue as UuidOperator,
                        value,
                    },
                };
                return progressToIdFilter;
            });

            return {
                OR: values,
            };
        }
        default: return {};
        }
    });
};

export const GET_PAGINATED_ORGANIZATION_GRADES = gql`
query getOrganizationGrades(
    $direction: ConnectionDirection!
    $count: PageSize
    $cursor: String
    $orderBy: [GradeSortBy!]!
    $order: SortOrder!
    $filter: GradeFilter!
){
    gradesConnection(
        direction: $direction
        directionArgs: { count: $count, cursor: $cursor }
        sort: { field: $orderBy, order: $order }
        filter: $filter
    ) {
        totalCount
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
        edges {
            node {
                id
                name
                status
                system
                fromGrade {
                    id
                    name
                    status
                    system
                }
                toGrade {
                    id
                    name
                    status
                    system
                }
            }
        }
    }
}`;

export const GET_PAGINATED_ORGANIZATION_GRADES_LIST = gql`
query getOrganizationGrades(
    $direction: ConnectionDirection!
    $count: PageSize
    $cursor: String
    $orderBy: [GradeSortBy!]!
    $order: SortOrder!
    $filter: GradeFilter!
){
    gradesConnection(
        direction: $direction
        directionArgs: { count: $count, cursor: $cursor }
        sort: { field: $orderBy, order: $order }
        filter: $filter
    ) {
        totalCount
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
        edges {
            node {
                id
                name
                system
            }
        }
    }
}`;
