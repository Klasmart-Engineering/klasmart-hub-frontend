import { gql } from "@apollo/client";

export const LEAVE_MEMBERSHIP = gql`
    mutation user($user_id: ID!, $organization_id: ID!) {
        user(user_id: $user_id) {
            membership(organization_id: $organization_id) {
                leave
            }
        }
    }
`;
