import { gql } from "@apollo/client";

export const GET_ORGANIZATION_ROLES = gql`
    query getOrganizationRoles($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            roles {
                role_id
                role_name
                role_description
                system_role
                status
            }
        }
    }
`;
