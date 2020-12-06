import { gql } from "@apollo/client";

export const EDIT_USER = gql`
    mutation user(
        $user_id: ID!
        $user_name: String
        $given_name: String
        $family_name: String
        $email: String
        $avatar: String
    ) {
        user(
        user_id: $user_id
        user_name: $user_name
        email: $email
        avatar: $avatar
        ) {
        user_id
        set(
            user_name: $user_name
            given_name: $given_name
            family_name: $family_name
            email: $email
            avatar: $avatar
        ) {
            user_id
            user_name
            avatar
        }
        }
    }
`;
