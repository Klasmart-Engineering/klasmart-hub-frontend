import { gql } from "@apollo/client";

export const CREATE_ORGANIZATION = gql`
    mutation user(
        $user_id: ID!
        $organization_name: String
        $email: String
        $address1: String
        $address2: String
        $phone: String
        $shortCode: String
    ) {
        user(user_id: $user_id) {
            createOrganization(
                organization_name: $organization_name
                email: $email
                address1: $address1
                address2: $address2
                phone: $phone
                shortCode: $shortCode
            ) {
                organization_id
                organization_name
            }
        }
    }
`;
