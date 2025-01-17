import { gql } from "@apollo/client";

export const DEACTIVATE_USER_IN_ORGANIZATION = gql`
    mutation deactivateUserInOrganization($userIds: [ID!]!, $organizationId: ID!) {
        removeUsersFromOrganizations(
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
