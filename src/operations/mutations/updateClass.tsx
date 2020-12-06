import { gql } from "@apollo/client";

export const UPDATE_CLASS = gql`
    mutation class($class_id: ID!, $class_name: String, $school_ids: [ID!]) {
        class(class_id: $class_id) {
        class_id
        class_name
        set(class_name: $class_name) {
            class_id
            class_name
            editSchools(school_ids: $school_ids) {
                school_id
                school_name
                }
            }
        }
    }
`;
