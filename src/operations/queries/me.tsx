import { gql } from "@apollo/client";

export const ME = gql`
    query me {
        me {
            avatar
            email
            phone
            user_id
            username
            given_name
            family_name
        }
    }
`;
