import { gql } from "@apollo/client";

export const EDIT_PROGRAM_AGE_RANGES = gql`
    mutation program($id: ID!, $age_range_ids: [ID!]) {
        program(id: $id) {
            id
            name
            editAgeRanges(age_range_ids: $age_range_ids) {
                id
                name
                low_value
                low_value_unit
                high_value
                high_value_unit
                system
                status
            }
        }
    }
`;
