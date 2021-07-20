import { SchoolFilter } from "@/api/schools";
import { Status } from "@/types/graphQL";
import { isUuid as isUuid } from "@/utils/pagination";
import { gql } from "@apollo/client";

export interface SchoolPaginationFilter {
    organizationId: string;
    search: string;
}

export const buildOrganizationSchoolSearchFilter = (search: string): SchoolFilter => ({
    ...isUuid(search)
        ? {
            schoolId: {
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
                {
                    shortCode: {
                        operator: `contains`,
                        value: search,
                        caseInsensitive: true,
                    },
                },
            ],
        },
});

export const buildOrganizationSchoolFilter = (filter: SchoolPaginationFilter): SchoolFilter => ({
    status: {
        operator: `eq`,
        value: Status.ACTIVE,
    },
    organizationId: {
        operator: `eq`,
        value: filter.organizationId,
    },
    AND: [ buildOrganizationSchoolSearchFilter(filter.search) ],
});

export const GET_PAGINATED_ORGANIZATION_SCHOOLS = gql`
    query getOrganizationSchools(
        $direction: ConnectionDirection!
        $count: Int
        $cursor: String
        $orderBy: [SchoolSortBy!]!
        $order: SortOrder!
        $filter: SchoolFilter
    ) {
        schoolsConnection(
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
                    shortCode
                }
            }
        }
    }
`;
