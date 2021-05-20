import { gql } from "@apollo/client";

export const GET_ORGANIZATION_ACADEMIC_PROFILES = gql`
    query getOrganizationAcademicProfile($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            ageRanges {
                id
                name
                high_value
                high_value_unit
                low_value
                low_value_unit
                status
            }
            programs {
                id
                name
                status
            }
            subjects {
                id
                name
                status
            }
            grades {
                id
                name
                status
            }
        }
    }
`;
