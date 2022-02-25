import { gql } from "@apollo/client";

export const REACTIVATE_USER_IN_ORGANIZATION = gql`
    mutation reactivateUserInOrganization($user_ids: [ID!], $organization_id: ID!) {
        reactivateUsersFromOrganizations(userIds: $user_ids, organizationId: $organization_id) {
            organizations {
                id
            }
        }
    }
`;
