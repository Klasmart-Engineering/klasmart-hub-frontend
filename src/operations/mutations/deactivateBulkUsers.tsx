import { gql } from "@apollo/client";

export const DEACTIVATE_BULK_USERS_IN_ORGANIZATION = gql`
mutation deactivateAllUserInOrganization($userIds: [ID!]!, $organizationId: ID!) {
    removeUsersFromOrganizations(
        input: [{
            organizationId: $organizationId
            userIds: $userIds, 
        }]
    )
}
`;
