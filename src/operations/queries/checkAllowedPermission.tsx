import { gql } from "@apollo/client";

export const CHECK_ALLOWED = gql`
    query me($organization_id: ID!, $permission_name: ID!) {
        me {
            membership(organization_id: $organization_id) {
                checkAllowed(permission_name: $permission_name)
            }
        }
    }
`;
