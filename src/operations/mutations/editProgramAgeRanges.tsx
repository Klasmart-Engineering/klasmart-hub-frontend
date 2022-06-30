import { gql } from "@apollo/client";

export const EDIT_PROGRAM_AGE_RANGES = gql`
    mutation program($id: ID!, $age_range_ids: [ID!]) {
        updatePrograms(input: [{id: $id, ageRangeIds: $age_range_ids}]) {
            programs {
              id
              name
              status
              system
              ageRangesConnection {
                edges {
                  node {
                    name
                    id
                  }
               }
            }
          }
       }
    }
`;
