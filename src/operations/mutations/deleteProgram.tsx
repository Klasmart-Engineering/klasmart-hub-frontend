import { gql } from "@apollo/client";

export const DELETE_PROGRAM = gql`
    mutation program($id: ID!) {
        program(id: $id) {
            delete
        }
    }
`;
