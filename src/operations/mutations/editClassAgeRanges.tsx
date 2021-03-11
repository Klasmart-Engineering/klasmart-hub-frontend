import { gql } from "@apollo/client";

export const EDIT_CLASS_AGE_RANGES = gql`
    mutation class($class_id: ID!, $age_range_ids: [ID!]) {
        class(class_id: $class_id) {
            class_id
            class_name
            editAgeRanges(age_range_ids: $age_range_ids) {
                id
                name
            }
        }
    }
`;
