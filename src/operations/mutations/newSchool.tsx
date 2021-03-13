import { gql } from "@apollo/client";

export const CREATE_SCHOOL = gql`
    mutation organization($organization_id: ID!, $school_name: String, $shortcode: String) {
        organization(organization_id: $organization_id) {
            createSchool(school_name: $school_name, shortcode: $shortcode) {
                school_id
            }
        }
    }
`;
