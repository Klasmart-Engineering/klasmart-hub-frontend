import { gql } from "@apollo/client";

export const REMOVE_STUDENT_FROM_CLASS = gql`
    mutation class($class_id: ID!, $user_id: ID!) {
        class(class_id: $class_id) {
            removeStudent(user_id: $user_id)
        }
    }
`;
