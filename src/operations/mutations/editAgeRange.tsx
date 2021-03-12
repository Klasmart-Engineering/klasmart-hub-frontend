import { gql } from "@apollo/client";

export const EDIT_AGE_RANGE = gql`
    mutation organization(
        $organization_id: ID!
        $id: ID!
        $name: String
        $low_value: Int
        $high_value: Int
        $low_value_unit: AgeRangeUnit
        $high_value_unit: AgeRangeUnit
    ) {
        organization(organization_id: $organization_id) {
        createOrUpdateAgeRanges(
            age_ranges: [{
                id: $id
                name: $name
                low_value: $low_value
                low_value_unit: $low_value_unit
                high_value: $high_value
                high_value_unit: $high_value_unit
            }]
        ) {
            id
        }
        }
    }
`;
