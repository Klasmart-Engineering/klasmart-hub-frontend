import { gql } from "@apollo/client";

export const MY_USER = gql`
    query myUser {
        myUser {
            node {
                id
                familyName
                givenName
                avatar
                contactInfo {
                    email
                    phone
                }
            }
        }
    }
`;
