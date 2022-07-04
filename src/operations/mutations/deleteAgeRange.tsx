import { gql } from "@apollo/client";

export const DELETE_AGE_RANGE = gql`
    mutation age_range($id: ID!) {
        deleteAgeRanges(input: [{id: $id}]) {
            ageRanges {
              id
            }
          }
        }
`;
