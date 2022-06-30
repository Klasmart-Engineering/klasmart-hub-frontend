import { gql } from "@apollo/client";

export const EDIT_PROGRAM_GRADES = gql`
    mutation program($id: ID!, $grade_ids: [ID!]) {
        updatePrograms(input: [{id: $id, gradeIds: $grade_ids}]) {
            programs {
              id
              name
              status
              system
              gradesConnection {
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
