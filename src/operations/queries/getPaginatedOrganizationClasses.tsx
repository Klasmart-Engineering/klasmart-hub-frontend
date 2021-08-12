import { ClassesFilter } from "@/api/classes";
import { isUuid } from "@/utils/pagination";
import { gql } from "@apollo/client";

export interface ClassPaginationFilter {
    organizationId: string;
    search: string;
    filters: ClassesFilter[];
}

export const buildOrganizationClassesSearchFilter = (search: string): ClassesFilter => ({
    ...isUuid(search)
        ? {
            id: {
                operator: `eq`,
                value: search,
            },
        }
        : {
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

export const buildOrganizationClassesFilter = (filter: ClassPaginationFilter): ClassesFilter => ({
    organizationId: {
        operator: `eq`,
        value: filter.organizationId,
    },
    AND: [ buildOrganizationClassesSearchFilter(filter.search) ],
});

export const GET_PAGINATED_ORGANIZATION_CLASSES = gql`
query getOrganizationClasses(
    $direction: ConnectionDirection!
    $count: Int
    $cursor: String
    $orderBy: ClassSortBy!
    $order: SortOrder!
    $filter: ClassFilter
) {
    classesConnection(
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
                schools {
                    id
                    name
                }
                ageRanges {
                    id
                    name
                    lowValue
                    lowValueUnit
                    highValue
                    highValueUnit
                }
                grades {
                    id
                    name
                }
                subjects {
                    id
                    name
                }
                programs {
                    id
                    name
                }
            }
        }
    }
}
`;
