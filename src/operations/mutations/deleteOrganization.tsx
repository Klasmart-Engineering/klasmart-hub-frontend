import { gql } from "@apollo/client";

export const DELETE_ORGANIZATION = gql`
    mutation organization($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            delete
        }
    }
`;
