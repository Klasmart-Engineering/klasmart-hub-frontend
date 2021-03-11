import { gql } from "@apollo/client";

export const EDIT_CLASS_PROGRAMS = gql`
    mutation class($class_id: ID!, $program_ids: [ID!]) {
        class(class_id: $class_id) {
            class_id
            class_name
            editPrograms(program_ids: $program_ids) {
                id
                name
            }
        }
    }
`;
