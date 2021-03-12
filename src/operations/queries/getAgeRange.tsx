import { gql } from "@apollo/client";

export const GET_AGE_RANGES = gql`
    query organization($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            ageRanges {
                id
                name
                low_value
                high_value
                low_value_unit
                high_value_unit
                system
                status
            }
        }
    }
`;
