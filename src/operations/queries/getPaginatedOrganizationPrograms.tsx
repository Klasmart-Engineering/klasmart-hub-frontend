import { ProgramFilter } from "@/api/programs";
import { Status } from "@/types/graphQL";
import { isUuid } from "@/utils/pagination";
import { gql } from "@apollo/client";

export interface ProgramPaginationFilter {
    organizationId: string;
    search: string;
}

export const buildOrganizationProgramSearchFilter = (search: string): ProgramFilter => ({
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

export const buildOrganizationProgramFilter = (filter: ProgramPaginationFilter): ProgramFilter => ({
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
        {
            AND: [ buildOrganizationProgramSearchFilter(filter.search) ],
        },
    ],
});

export const buildProgramIdsFilter = (ids: string[]): ProgramFilter => ({
    OR: ids.map((id) => ({
        id: {
            operator: `eq`,
            value: id,
        },
    })),
});

export const GET_PAGINATED_ORGANIZATION_PROGRAMS = gql`
    query getOrganizationPrograms(
        $direction: ConnectionDirection!
        $count: Int
        $cursor: String
        $orderBy: [ProgramSortBy!]!
        $order: SortOrder!
        $filter: ProgramFilter
    ) {
        programsConnection(
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
                    ageRanges {
                        id
                        name
                        status
                        system
                        highValue
                        highValueUnit
                        lowValue
                        lowValueUnit
                    }
                    subjects {
                        id
                        name
                        status
                        system
                    }
                    grades {
                        id
                        name
                        status
                        system
                    }
                }
            }
        }
    }
`;
