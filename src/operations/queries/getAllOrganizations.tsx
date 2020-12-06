import { gql } from "@apollo/client";

export const GET_ALL_ORGANIZATIONS = gql`
    query {
        organizations {
        id
        name
        email
        primaryContact
        phone
        }
    }
`;
