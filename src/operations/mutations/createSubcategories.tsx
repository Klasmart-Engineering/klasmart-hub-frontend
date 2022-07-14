import { gql } from "@apollo/client";

export const CREATE_SUBCATEGORIES = gql`
    mutation createSubcategories($input: [CreateSubcategoryInput!]!) {
        createSubcategories(input: $input) {
            subcategories {
                id
            }
        }
    }
`;
