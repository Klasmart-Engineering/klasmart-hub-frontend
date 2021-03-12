import { gql } from "@apollo/client";

export const CREATE_OR_UPDATE_SUBCATEGORIES = gql`
    mutation organization(
        $organization_id: ID!
        $subcategories: [SubcategoryDetail]!
    ) {
        organization(organization_id: $organization_id) {
            createOrUpdateSubcategories(subcategories: $subcategories) {
                id
            }
        }
    }
`;
