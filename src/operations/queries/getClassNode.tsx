import { gql } from "@apollo/client";

export const GET_CLASS_NODE = gql`
    query getClassNode($id: ID!) {
        classNode(id: $id) {
            name
            status
            shortCode
                    schools {
                id
                name
                status
            }
            programs {
                id
                name
                status
            }
            grades {
                id
                name
                status
            }
            ageRanges {
                id
                name
                status
                lowValue
                lowValueUnit
                highValue
                highValueUnit
            }
            subjects {
                id
                name
                status
            }
        }
    }
`;

export const GET_CLASS_NODE_CONNECTIONS = gql`
    query getClass ($id: ID!) {
        classNode(id: $id) {
            id
            name
            status
            schoolsConnection(count: 50, direction: FORWARD) {
                edges {
                    node {
                        id
                    }
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    endCursor
                    startCursor
                }
                totalCount
            }
            programsConnection(count: 50, direction: FORWARD) {
                edges {
                    node {
                        id
                    }
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    endCursor
                    startCursor
                }
                totalCount
            }
            gradesConnection(count: 50, direction: FORWARD) {
                edges {
                    node {
                        id
                    }
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    endCursor
                    startCursor
                }
                totalCount
            }
            ageRangesConnection(count: 50, direction: FORWARD) {
                edges {
                    node {
                        id
                    }
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    endCursor
                    startCursor
                }
                totalCount
            }
            subjectsConnection(count: 50, direction: FORWARD) {
                edges {
                    node {
                        id
                    }
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    endCursor
                    startCursor
                }
                totalCount
            }
            academicTerm {
                id
                name
            }
        }
    }
`;

export const GET_CLASS_NODE_SCHOOLS_CONNECTION = gql`
    query getClass ($id: ID!, $cursor: String) {
        classNode(id: $id) {
            schoolsConnection(count: 50, direction: FORWARD, cursor: $cursor) {
                edges {
                    node {
                        id
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    }
`;

export const GET_CLASS_NODE_PROGRAMS_CONNECTION = gql`
    query getClass ($id: ID!, $cursor: String) {
        classNode(id: $id) {
            programsConnection(count: 50, direction: FORWARD, cursor: $cursor) {
                edges {
                    node {
                        id
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    }
`;

export const GET_CLASS_NODE_GRADES_CONNECTION = gql`
    query getClass ($id: ID!, $cursor: String) {
        classNode(id: $id) {
            gradesConnection(count: 50, direction: FORWARD, cursor: $cursor) {
                edges {
                    node {
                        id
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    }
`;

export const GET_CLASS_NODE_AGE_RANGES_CONNECTION = gql`
    query getClass ($id: ID!, $cursor: String) {
        classNode(id: $id) {
            ageRangesConnection(count: 50, direction: FORWARD, cursor: $cursor) {
                edges {
                    node {
                        id
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    }
`;

export const GET_CLASS_NODE_SUBJECTS_CONNECTION = gql`
    query getClass ($id: ID!, $cursor: String) {
        classNode(id: $id) {
            subjectsConnection(count: 50, direction: FORWARD, cursor: $cursor) {
                edges {
                    node {
                        id
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    }
`;
