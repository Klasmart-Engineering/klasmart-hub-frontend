import { gql } from "@apollo/client";

export const DELETE_ORGANIZATION = gql`
    mutation deleteOrganizations($organization_id: ID!) {
        deleteOrganizations(input: [{id: $organization_id}]) {
            organizations {
              id
            }
        }
    }
`;
