import { gql } from "@apollo/client";

export const GET_PAGINATED_ORGANIZATION_PROGRAMS = gql`
    query getOrganizationPrograms(
        $direction: ConnectionDirection!
        $count: Int
        $cursor: String
        $organizationId: UUID!
        $orderBy: ProgramSortBy!
        $order: SortOrder!
        $filter: ProgramFilter!
    ) {
        programsConnection(
            direction: $direction
            directionArgs: { count: $count, cursor: $cursor }
            sort: { field: $orderBy, order: $order }
            filter: {
                status: { operator: eq, value: "active" }
                AND: [
                    {
                        OR: [
                            { organizationId: { operator: eq, value: $organizationId } }
                            { system: { operator: eq, value: true } }
                        ]
                    }
                    { OR: [$filter] }
                ]
            }
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
