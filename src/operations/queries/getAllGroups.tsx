import { gql } from "@apollo/client";

export const GET_ALL_GROUPS = gql`
    query organization($organization_id: ID!) {
        organization(organization_id: $organization_id) {
        roles {
            role_id
            role_name
        }
        }
    }
`;