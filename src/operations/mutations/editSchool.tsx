import { gql } from "@apollo/client";

export const EDIT_SCHOOL = gql`
    mutation school($id: ID!, $organizationId: ID!, $name: String!, $shortCode: String!) {
            updateSchools(input: [{id: $id, organizationId: $organizationId, name: $name, shortCode: $shortCode}]) {
                schools {
                  id
                  name
                }
              }
            }
`;
