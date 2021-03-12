import { gql } from "@apollo/client";

export const GET_SUBJECT = gql`
    mutation Query($subject_id: ID!) {
        subject(id: $subject_id) {
            id
        }
    }
`;
