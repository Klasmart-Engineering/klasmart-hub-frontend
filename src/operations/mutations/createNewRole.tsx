import { gql } from "@apollo/client";

export const CREATE_NEW_ROLE = gql`
    mutation organization(
        $organization_id: ID!
        $role_name: String!
        $role_description: String!
        $permission_names: [String!]
    ) {
        organization(organization_id: $organization_id) {
            createRole(
                role_name: $role_name
                role_description: $role_description
            ) {
                role_name
                role_id
                edit_permissions(permission_names: $permission_names) {
                    permission_id
                }
            }
        }
    }
`;
