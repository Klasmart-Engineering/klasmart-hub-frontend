import { gql } from "@apollo/client";

export const GET_ALL_ORGANIZATIONS = gql`
    query {
        organizations {
            organization_id
            organization_name
            status
            phone
        }
    }
`;
