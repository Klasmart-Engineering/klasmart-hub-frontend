import { gql } from "@apollo/client";

export const CREATE_CATEGORIES = gql`
    mutation createCategories($input: [CreateCategoryInput!]!) {
        createCategories(input: $input) {   
            categories {        
                id
                name
                status
                system
            }
        }
    }
`;

export const UPDATE_CATEGORIES = gql`
    mutation updateCategories($input: [UpdateCategoryInput!]!) {
        updateCategories(input: $input) {   
            categories {        
                id
                name
                status
                system
            }
        }
    }
`;
