import { GradeFilter } from "@/api/grades";
import { isUuid } from "@/utils/pagination";
import { gql } from "@apollo/client";

export interface GradePaginationFilter {
    organizationId: string;
    search: string;
}

export const buildGradeSearchFilter = (search: string): GradeFilter => ({
    ...isUuid(search)
        ? {
            id: {
                operator: `eq`,
                value: search,
            },
        } :
        {
            OR: [
                {
                    name: {
                        operator: `contains`,
                        value: search,
                        caseInsensitive: true,
                    },
                },
            ],
        },
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
            AND: [ buildGradeSearchFilter(filter.search) ],
        },
    ],
});

export const GET_PAGINATED_ORGANIZATION_GRADES = gql`
query getOrganizationGrades(
    $direction: ConnectionDirection!
    $count: Int
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
