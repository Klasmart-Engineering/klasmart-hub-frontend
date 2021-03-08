import { gql } from "@apollo/client";

export const SWITCH_USER = gql`
    mutation switchUser(
        $user_id: ID!
    ) {
        switch_user(
            user_id: $user_id
        ) {
            user_id
            given_name
            family_name
            date_of_birth
            username
        }
    }
`;
