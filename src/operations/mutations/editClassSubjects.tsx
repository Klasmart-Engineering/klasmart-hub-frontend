import { gql } from "@apollo/client";

export const EDIT_CLASS_SUBJECTS = gql`
    mutation class($class_id: ID!, $subject_ids: [ID!]) {
        class(class_id: $class_id) {
            class_id
            class_name
            editSubjects(subject_ids: $subject_ids) {
                id
                name
            }
        }
    }
`;
