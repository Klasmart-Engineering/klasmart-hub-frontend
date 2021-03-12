import { gql } from "@apollo/client";

export const DELETE_GRADE = gql`
    mutation deleteGrade($id: ID!) {
        grade(id: $id) {
            delete
        }
    }
`;
