import { gql } from "@apollo/client";

export const ADD_STUDENT_TO_CLASS = gql`
    mutation class($class_id: ID!, $user_id: ID!) {
        class(class_id: $class_id) {
        addStudent(user_id: $user_id) {
            user_id
            user_name
            email
        }
        }
    }
`;
