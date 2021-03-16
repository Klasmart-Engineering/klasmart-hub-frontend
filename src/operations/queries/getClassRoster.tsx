import { gql } from "@apollo/client";

export const GET_CLASS_ROSTER = gql`
    query class($class_id: ID!) {
        class(class_id: $class_id) {
            students {
                user_id
                full_name
                given_name
                family_name
                email
                phone
                date_of_birth
                avatar
                username
            }
            teachers {
                user_id
                full_name
                given_name
                family_name
                email
                phone
                date_of_birth
                avatar
                username
            }
        }
    }
`;