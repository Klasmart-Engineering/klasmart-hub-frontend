import { gql } from "@apollo/client";

export const GET_SHORT_CODE = gql`
    query shortCode($name: String!) {
        shortCode(name: $name)
    }
`;
