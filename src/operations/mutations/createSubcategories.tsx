import { gql } from "@apollo/client";

export const CREATE_SUBCATEGORIES = gql`
    mutation organization($input: [CreateSubcategoryInput!]!) {
        createSubcategories(input: $input) {
            subcategories {
                id
            }
        }
    }
`;
