import { gql } from "@apollo/client";

export const CREATE_OR_UPDATE_CATEGORIES = gql`
    mutation organization($organization_id: ID!, $categories: [CategoryDetail]!) {
        organization(organization_id: $organization_id) {
            createOrUpdateCategories(categories: $categories) {
                id
            }
        }
    }
`;
