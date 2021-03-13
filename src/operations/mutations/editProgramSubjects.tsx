import { gql } from "@apollo/client";

export const EDIT_PROGRAM_SUBJECTS = gql`
    mutation program($id: ID!, $subject_ids: [ID!]) {
        program(id: $id) {
            id
            name
            editSubjects(subject_ids: $subject_ids) {
                id
                name
                categories {
                    id
                }
                system
                status
            }
        }
    }
`;
