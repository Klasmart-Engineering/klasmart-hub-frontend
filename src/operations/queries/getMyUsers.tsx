import { gql } from "@apollo/client";

export const GET_MY_USERS = gql`
    query {
        my_users {
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
`;
