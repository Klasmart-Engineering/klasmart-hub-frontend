import { gql } from "@apollo/client";

export const ADD_USER_TO_ORGANIZATION = gql`
    mutation organization($organization_id: ID!, $user_id: ID!) {
        organization(organization_id: $organization_id) {
        addUser(user_id: $user_id) {
            user_id
            organization_id
        }
        }
    }
`;
