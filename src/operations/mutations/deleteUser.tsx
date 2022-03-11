import { gql } from "@apollo/client";

export const DELETE_USER_IN_ORGANIZATION = gql`
    mutation deleteUserInOrganization($userIds: [ID!]!, $organizationId: ID!) {
        deleteUsersFromOrganizations(
            input: [{
                organizationId: $organizationId
                userIds: $userIds, 
            }]
        ) {
            organizations {
                id
            }
        }
    }
`;
