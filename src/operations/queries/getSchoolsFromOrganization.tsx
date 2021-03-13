import { gql } from "@apollo/client";

export const GET_SCHOOLS_FROM_ORGANIZATION = gql`
    query organization($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            schools {
                school_id
                school_name
                status
                shortcode
                programs {
                    id
                    name
                    grades {
                        id
                        name
                    }
                    subjects {
                        id
                        name
                    }
                    age_ranges {
                        id
                        name
                        low_value
                        low_value_unit
                        high_value
                        high_value_unit
                        system
                        status
                    }
                    status
                }
            }
        }
    }
`;
