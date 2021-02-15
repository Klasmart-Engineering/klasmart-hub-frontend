import { gql } from "@apollo/client";

export const DELETE_ROLE = gql`
    mutation role($role_id: ID!) {
        role(role_id: $role_id) {
            delete_role
        }
    }
`;
