import { gql } from "@apollo/client";

export const DELETE_SUBJECT = gql`
    mutation subject($id: ID!) {
        deleteSubjects(input: [{id: $id}]) {
            subjects {
              id
            }
          }
    }
`;
