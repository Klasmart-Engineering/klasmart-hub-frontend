import { gql } from "@apollo/client";

export const GET_SCHOOLS_FROM_ORGANIZATION = gql`
  query organization($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      schools {
        school_id
        school_name
      }
    }
  }
`;
