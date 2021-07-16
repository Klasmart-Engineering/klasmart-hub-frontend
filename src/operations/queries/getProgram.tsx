import { gql } from "@apollo/client";

export const GET_PROGRAM = gql`
    query getProgram($id: ID!) {
        program(id: $id) {
            id
            name
            status
            system
            age_ranges {
                id
                name
                high_value
                high_value_unit
                low_value
                low_value_unit
                status
                system
            }
            subjects {
                id
                name
                status
                system
                categories {
                    id
                    name
                    status
                    subcategories {
                        id
                        name
                        status
                    }
                }
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
