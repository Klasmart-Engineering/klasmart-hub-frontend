import { gql } from "@apollo/client";

export const GET_ORGANIZATION = gql`
    query getOrganization($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            organization_id
            organization_name
            address1
            address2
            phone
            shortCode
            branding {
                iconImageURL
                primaryColor
            }
        }
    }
`;
