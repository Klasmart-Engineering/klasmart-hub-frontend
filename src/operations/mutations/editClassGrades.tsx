import { gql } from "@apollo/client";

export const EDIT_CLASS_GRADES = gql`
    mutation class($class_id: ID!, $grade_ids: [ID!]) {
        class(class_id: $class_id) {
            class_id
            class_name
            editGrades(grade_ids: $grade_ids) {
                id
                name
            }
        }
    }
`;
