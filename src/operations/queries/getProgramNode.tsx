import { gql } from "@apollo/client";

export const GET_PROGRAM_NODE = gql`
    query getProgramNode($id: ID!) {
        programNode(id: $id) {
            id
            name
            status
            system
            ageRanges {
                id
                name
                status
                system
                lowValue
                lowValueUnit
                highValue
                highValueUnit
            }
            subjects {
                id
                name
                status
                system
            }
            grades {
                id
                name
                status
                system
            }
        }
    }
`;
