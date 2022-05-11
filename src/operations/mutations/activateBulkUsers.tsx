import { gql } from "@apollo/client";

export const REACTIVATE_BULK_USERS_IN_ORGANIZATION = gql`
mutation reactivateAllUserInOrganization($userIds: [ID!]!, $organizationId: ID!) {
    reactivateUsersFromOrganizations(
        input: [{
            organizationId: $organizationId
            userIds: $userIds, 
        }]){
            organizations {
                id
            }  
        }
    }
`;
