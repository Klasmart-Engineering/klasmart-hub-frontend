import { gql } from "@apollo/client";

export const DELETE_ACADEMIC_TERM = gql`
    mutation deleteAcademicTerm($id: ID!) {
        deleteAcademicTerms(input: [{ id: $id }]) {
            academicTerms {
                id
            }
        }
    }
`;
