import { gql } from "@apollo/client";

export const GET_PAGINATED_ORGANIZATION_SUBJECTS = gql`
    query getOrganizationSubjects(
        $direction: ConnectionDirection!
        $count: Int
        $cursor: String
        $orderBy: SubjectSortBy!
        $order: SortOrder!
        $filter: SubjectFilter
    ) {
        subjectsConnection(
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
                    categories {
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
