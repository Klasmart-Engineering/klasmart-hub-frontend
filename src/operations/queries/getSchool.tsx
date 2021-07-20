import { gql } from "@apollo/client";

export const GET_SCHOOL = gql`
    query getSchool($school_id: ID!) {
        school(school_id: $school_id) {
            school_id
            school_name
            status
            shortcode
            programs {
                id
                name
                status
                grades {
                    id
                    name
                    status
                }
                subjects {
                    id
                    name
                    status
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
            }
        }
    }
`;
