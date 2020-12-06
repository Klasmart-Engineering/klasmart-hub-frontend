import { gql } from "@apollo/client";

export const REMOVE_TEACHER_FROM_CLASS = gql`
    mutation class($class_id: ID!, $user_id: ID!) {
        class(class_id: $class_id) {
        removeTeacher(user_id: $user_id)
        }
    }
`;
