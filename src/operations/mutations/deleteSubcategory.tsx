import { gql } from "@apollo/client";

export const DELETE_SUBCATEGORY = gql`
    mutation subcategory($id: ID!) {
        subcategory(id: $id) {
            delete
        }
    }
`;
