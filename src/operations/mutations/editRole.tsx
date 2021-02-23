import { gql } from "@apollo/client";

export const EDIT_ROLE = gql`
    mutation role(
        $role_id: ID!
        $role_name: String
        $role_description: String
        $permission_names: [String!]
    ) {
        role(role_id: $role_id) {
            role_id
            role_name
            edit_permissions(permission_names: $permission_names) {
                permission_id
            }
            set(role_name: $role_name, role_description: $role_description) {
                role_id
                role_name
            }
        }
    }
`;
