import { gql } from "@apollo/client";

export const EDIT_PROGRAM_SUBJECTS = gql`
    mutation program($id: ID!, $subject_ids: [ID!]) {
        updatePrograms(input: [{id: $id, subjectIds: $subject_ids}]) {
            programs {
              id
              name
              status
              system
              subjectsConnection {
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
