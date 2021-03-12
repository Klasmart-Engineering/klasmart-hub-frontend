import { gql } from "@apollo/client";

export const DELETE_AGE_RANGE = gql`
    mutation age_range($id: ID!) {
        age_range(id: $id) {
            delete
        }
    }
`;
