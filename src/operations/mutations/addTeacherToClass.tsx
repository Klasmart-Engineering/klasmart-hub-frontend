import { gql } from "@apollo/client";

export const ADD_TEACHER_TO_CLASS = gql`
    mutation class($class_id: ID!, $user_id: ID!) {
        class(class_id: $class_id) {
            addTeacher(user_id: $user_id) {
                user_id
                user_name
                email
            }
        }
    }
`;
