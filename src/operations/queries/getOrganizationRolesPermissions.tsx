import { gql } from "@apollo/client";

export const GET_ORGANIZATION_ROLES_PERMISSIONS = gql`
    query organization($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            roles {
                role_id
                role_name
                permissions {
                    permission_name
                    permission_id
                    permission_group
                    permission_level
                    permission_category
                    permission_description
                }
            }
        }
    }
`;
