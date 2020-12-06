import { gql } from "@apollo/client";

export const DELETE_CLASS = gql`
    mutation class($class_id: ID!) {
        class(class_id: $class_id) {
        delete
        }
    }
`;
