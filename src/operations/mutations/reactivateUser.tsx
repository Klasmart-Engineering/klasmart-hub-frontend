import { gql } from "@apollo/client";

export const REACTIVATE_USER_IN_ORGANIZATION = gql`
mutation reactivateUserInOrganization($userIds: [ID!]!, $organizationId: ID!) {
    reactivateUsersFromOrganizations(
        input: [{
            organizationId: $organizationId
            userIds: $userIds, 
        }]
    ) {
        organizations {
            id
        }
    }
}`;
