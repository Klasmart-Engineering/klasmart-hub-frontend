import { gql } from "@apollo/client";

export const GET_AGE_RANGE = gql`
    query getAgeRange($id: ID!) {
        age_range(id: $id) {
            id
            name
            low_value
            high_value
            low_value_unit
            high_value_unit
            system
            status
        }
    }
`;
