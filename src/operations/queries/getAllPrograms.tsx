import { gql } from "@apollo/client";

export const GET_ALL_PROGRAMS = gql`
    query organization($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            programs {
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
                    categories {
                        id
                        name
                    }
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
    }  
`;
