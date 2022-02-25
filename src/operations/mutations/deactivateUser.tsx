import { gql } from "@apollo/client";

export const DEACTIVATE_USER_IN_ORGANIZATION = gql`
    mutation deactivateUserInOrganization($user_ids: [ID!]!, $organization_id: ID!) {
        removeUsersFromOrganizations(
            input: {
                organizationId: $organization_id
                userIds: $user_ids, 
            }
        ) {
            organizations {
                id
            }
        }
    }
`;
