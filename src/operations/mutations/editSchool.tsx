import { gql } from "@apollo/client";

export const EDIT_SCHOOL = gql`
    mutation school($school_id: ID!, $school_name: String) {
        school(school_id: $school_id) {
        school_id
        set(school_name: $school_name) {
            school_id
            school_name
        }
        }
    }
`;
