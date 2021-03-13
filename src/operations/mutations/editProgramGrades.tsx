import { gql } from "@apollo/client";

export const EDIT_PROGRAM_GRADES = gql`
    mutation program($id: ID!, $grade_ids: [ID!]) {
        program(id: $id) {
            id
            name
            editGrades(grade_ids: $grade_ids) {
                id
                name
                progress_from_grade {
                    id
                }
                progress_to_grade {
                    id
                }
                system
                status
            }
        }
    }
`;
