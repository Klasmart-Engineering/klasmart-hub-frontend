import { gql } from "@apollo/client";

export const EDIT_SCHOOL_PROGRAMS = gql`
    mutation school($school_id: ID!, $program_ids: [ID!]) {
        school(school_id: $school_id) {
            school_id
            school_name
            editPrograms(program_ids: $program_ids) {
                id
                name    
            }
        }
    }
`;
