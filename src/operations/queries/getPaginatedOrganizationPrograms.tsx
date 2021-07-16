import { ProgramFilter } from "@/api/programs";
import { Status } from "@/types/graphQL";
import { gql } from "@apollo/client";

export const buildProgramOrganizationFilter = (organizationId = ``, filter: ProgramFilter[]): ProgramFilter => ({
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
                        value: organizationId,
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
            OR: filter,
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
        $filter: ProgramFilter!
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
