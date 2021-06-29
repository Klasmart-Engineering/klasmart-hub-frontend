import { gql } from "@apollo/client";

export const GET_PAGINATED_ORGANIZATION_GRADES = gql`
query getOrganizationGrades(
    $organizationId: UUID!
    $direction: ConnectionDirection!
    $count: Int
    $cursor: String
    $filter: GradeFilter!
){
    gradesConnection(
        direction: $direction
        directionArgs: { count: $count, cursor: $cursor }
        filter: {
            status: {
                operator: eq,
                value: "active",
            },
            AND: [
                {
                    OR: [
                        {
                            organizationId: {
                                operator: eq,
                                value: $organizationId,
                            },
                        },
                        {
                            system: {
                                operator: eq,
                                value: true,
                            },
                        },
                    ],
                },
                {
                    OR: [$filter]
                }
            ],
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
