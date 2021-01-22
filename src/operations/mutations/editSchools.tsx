import { gql } from "@apollo/client";

export const EDIT_CLASS_SCHOOLS = gql`
    mutation class($class_id: ID!, $school_ids: [ID!]) {
        class(class_id: $class_id) {
            class_id
            editSchools(school_ids: $school_ids) {
                school_id
                school_name
            }
        }
    }
`;
