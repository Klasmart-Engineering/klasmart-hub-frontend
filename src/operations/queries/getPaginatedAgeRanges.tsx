import { AgeRangeQueryFilter } from "@/api/ageRanges";
import { Status } from "@/types/graphQL";
import { gql } from "@apollo/client";

export interface AgeRangePaginationFilter {
    organizationId: string;
}

export const buildOrganizationAgeRangeFilter = (filter: AgeRangePaginationFilter): AgeRangeQueryFilter => ({
    status: {
        operator: `eq`,
        value: Status.ACTIVE,
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
    ],
});

export const GET_PAGINATED_AGE_RANGES = gql`
query getPaginatedAgeRanges(
    $count: Int
    $cursor: String
    $direction: ConnectionDirection!
    $orderBy: [AgeRangeSortBy!]!
    $order: SortOrder!
    $filter: AgeRangeFilter
){
    ageRangesConnection(
        direction: $direction
        directionArgs: { count: $count, cursor: $cursor }
        sort: { field: $orderBy, order: $order }
        filter: $filter
    ){
        totalCount
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
        edges {
            node {
                lowValue
                lowValueUnit
                highValue
                highValueUnit
            }
        }
    }
}
`;
