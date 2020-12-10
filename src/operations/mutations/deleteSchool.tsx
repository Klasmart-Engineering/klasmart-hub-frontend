import { gql } from "@apollo/client";

export const DELETE_SCHOOL = gql`
    mutation school($school_id: ID!) {
        school(school_id: $school_id) {
            delete
        }
    }
`;
