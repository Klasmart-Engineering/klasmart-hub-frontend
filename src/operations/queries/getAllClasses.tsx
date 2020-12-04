import { gql } from "@apollo/client";

export const GET_ALL_CLASSES = gql`
  query me($organization_id: ID!) {
    me {
      membership(organization_id: $organization_id) {
        organization {
          classes {
            schools {
              school_id
              school_name
            }
            class_id
            class_name
          }
        }
      }
    }
  }
`;
