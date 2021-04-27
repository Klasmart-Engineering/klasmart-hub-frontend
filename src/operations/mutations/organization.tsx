import { gql } from "@apollo/client";

export const SAVE_ORGANIZATION = gql`
    mutation organization(
        $organization_id: ID!
        $organization_name: String
        $address1: String
        $address2: String
        $phone: String
        $shortCode: String
    ) {
        organization(
            organization_id: $organization_id
            organization_name: $organization_name
            address1: $address1
            address2: $address2
            phone: $phone
            shortCode: $shortCode
        ) {
            organization_id
            organization_name
        }
    }
`;
