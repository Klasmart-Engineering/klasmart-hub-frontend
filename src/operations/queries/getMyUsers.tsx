import { gql } from "@apollo/client";

export const GET_MY_USERS = gql`
    query getMyUsers( $filter: UserFilter) {
        usersConnection(
            direction: FORWARD
            sort: { field: [givenName], order: ASC }
            filter: $filter
        ) 
        {
            edges {
                node {
                    id
                    givenName
                    familyName
                    avatar
                    contactInfo {
                        email
                        phone
                    }
                    status
                    organizations {
                        userStatus
                        joinDate
                    }
                    dateOfBirth
                }
            }
        }
    }
`;
