import { gql } from "@apollo/client";

export const DELETE_CLASS_STUDENT = gql`
    mutation class($class_id: ID!, $user_id: ID!) {
        class(class_id: $class_id) {
            removeStudent(user_id: $user_id)
        }
    }
`;
