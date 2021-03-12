import { gql } from "@apollo/client";

export const DELETE_CATEGORY = gql`
    mutation category($id: ID!) {
        category(id: $id) {
            delete
        }
    }
`;
