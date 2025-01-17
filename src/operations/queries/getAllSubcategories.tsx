import { gql } from "@apollo/client";

export const GET_ALL_SUBCATEGORIES = gql`
    query getOrganizationSubcategories($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            subcategories {
                id
                name
                system
                status
            }
        }
    }
`;
