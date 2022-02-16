import { gql } from "@apollo/client";

export const GET_CLASS_NODE_SUMMARY = gql`
    query getClassNode($id: ID!, $rosterCount: PageSize, $programsCount: PageSize, $subjectsCount: PageSize) {
        classNode(id: $id) {
            id
            name
            status
            programsConnection(
                count: $programsCount
                filter: { status: { operator: eq, value: "active" } }
            ) {
                totalCount
                edges {
                    node {
                        id
                        name
                        subjectsConnection(
                            count: $subjectsCount
                            filter: { status: { operator: eq, value: "active" } }
                        ) {
                            edges {
                                node {
                                    id
                                    name
                                }
                            }
                            totalCount
                        }
                    }
                }
            }
            studentsConnection(
                count: $rosterCount
                filter: { userStatus: { operator: eq, value: "active" } }
            ) {
                totalCount
                edges {
                    node {
                        givenName
                        familyName
                    }
                }
            }
            teachersConnection(
                count: $rosterCount
                filter: { userStatus: { operator: eq, value: "active" } }
            ) {
                totalCount
                edges {
                    node {
                        givenName
                        familyName
                    }
                }
            }
        }
    }
`;
