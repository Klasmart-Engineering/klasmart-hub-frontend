import { gql } from "@apollo/client";

export const GET_SCHOOL_USERS = gql`
  query organization($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      memberships {
        user {
          user_id
          user_name
          email
        }
      }
    }
  }
`;
