import { gql } from "@apollo/client";

export const GET_ROLE_PERMISSIONS = gql`
    query role($role_id: ID!) {
        role(role_id: $role_id) {
            role_id
            role_name
            status
            system_role
            permissions {
                permission_id
                permission_name
                permission_group
                permission_level
                permission_category
                permission_description
            }
        }
    }
`;
