import { gql } from "@apollo/client";

export const ADD_SCHOOL_TO_CLASS = gql`
    mutation class($class_id: ID!, $school_id: ID!) {
        class(class_id: $class_id) {
        addSchool(school_id: $school_id) {
            school_id
            school_name
        }
        }
    }
`;
