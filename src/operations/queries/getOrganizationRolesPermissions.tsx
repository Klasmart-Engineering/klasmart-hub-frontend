import { gql } from "@apollo/client";

export const GET_ORGANIZATION_ROLES_PERMISSIONS = gql`
    query getOrganizationRoles($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            roles {
                role_id
                role_name
                role_description
                system_role
                status
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
    }
`;
