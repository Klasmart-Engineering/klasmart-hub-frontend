import { gql } from "@apollo/client";

export const GET_SUBJECT = gql`
    query subject($subject_id: ID!) {
        subject(id: $subject_id) {
            id
            name
            status
            categories{
                id
                name
                status
                subcategories{
                    id
                    name
                    status
                }
            }
        }
    }
`;
