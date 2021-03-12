import { gql } from "@apollo/client";

export const DELETE_SUBJECT = gql`
    mutation subject($id: ID!) {
        subject(id: $id) {
            delete
        }
    }
`;
