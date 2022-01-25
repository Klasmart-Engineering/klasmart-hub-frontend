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
