import { gql } from "@apollo/client";

export const GET_PAGINATED_ORGANIZATION_USERS = gql`
    query getOrganizationUsers(
        $direction: ConnectionDirection!
            $count: Int
            $cursor: String
            $search: String
            $organizationId: UUID!
        ) {
            usersConnection(
                direction: $direction
                directionArgs: { count: $count, cursor: $cursor }
                filter: {
                    organizationId: { operator: eq, value: $organizationId }
                    OR: [
                        {
                            givenName: {
                                operator: contains
                                caseInsensitive: true
                                value: $search
                            }
                        }
                        {
                            familyName: {
                                operator: contains
                                caseInsensitive: true
                                value: $search
                            }
                        }
                        { email: { operator: contains, caseInsensitive: true, value: $search } }
                        { phone: { operator: contains, caseInsensitive: true, value: $search } }
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
                    givenName
                    familyName
                    avatar
                    status
                    organizations {
                        id
                        name
                        userStatus
                        joinDate
                    }
                    schools {
                        id
                        name
                        status
                    }
                    roles {
                        id
                        name
                        organizationId
                        status
                    }
                    contactInfo {
                        email
                        phone
                    }
                }
            }
        }
    }
`;
