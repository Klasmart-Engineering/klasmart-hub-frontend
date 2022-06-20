import { gql } from "@apollo/client";

export const GET_SCHOOL_NODE = gql`
    query getSchoolNode($id: ID!, $programCount: PageSize, $programCursor: String) {
        schoolNode(id: $id) {
            id
            name
            status
            shortCode
            programsConnection(
                count: $programCount
                cursor: $programCursor
            ) {
                edges {
                    node {
                        id
                    }
                }
                pageInfo {
                    hasPreviousPage
                    hasNextPage
                    endCursor
                }
            }
        }
    }
`;

export const GET_SCHOOL_NODE_WITH_CLASS_RELATIONS = gql`
    query getSchoolNodeWithClassRelations(
        $id: ID!, 
        $direction: ConnectionDirection!
        $count: PageSize
        $cursor: String
        $orderBy: ClassSortBy!
        $order: SortOrder!
        ) {
        schoolNode(id: $id) {
            id
            name
            status
            shortCode
            classesConnection(
                direction: $direction,
                count: $count, 
                cursor: $cursor,
                sort: { field: $orderBy, order: $order }
            ){
                totalCount
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    endCursor
                    startCursor
                }
                edges{
                    node {
                        id
                        name
                        status
                        schoolsConnection {
                            totalCount
                        }
                    }
                }
            }
        }
    }
`;
