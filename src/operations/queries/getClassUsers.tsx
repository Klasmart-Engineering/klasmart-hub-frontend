import { gql } from "@apollo/client";

export const GET_CLASS_USERS = gql`
    query class($class_id: ID!) {
        class(class_id: $class_id) {
            class_id
            class_name
            schools {
                school_id
                school_name
            }
            teachers {
                user_id
                given_name
                email
            }
            students {
                user_id
                given_name
                email
            }
        }
    }
`;
