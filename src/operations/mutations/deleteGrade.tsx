import { gql } from "@apollo/client";

export const DELETE_GRADE = gql`
    mutation deleteGrade($id: ID!) {
        deleteGrades(input: [{id: $id}]) {
            grades {
              id
            }
          }
    }
`;
