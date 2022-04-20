import { gql } from "@apollo/client";

export const GET_ALL_ACADEMIC_TERMS = gql`
    query($direction: ConnectionDirection!, $filter: SchoolFilter) {
        schoolsConnection(direction: $direction, filter:$filter) {
            totalCount
            pageInfo {
                hasPreviousPage
                startCursor
                hasNextPage
                endCursor
            }
            edges {
                node {
                    id
                    name
                    academicTermsConnection {
                        edges {
                            node {
                                id
                                name
                                startDate
                                endDate
                                status
                            }
                        }
                    }
                }
            }
        }
    }
`;
