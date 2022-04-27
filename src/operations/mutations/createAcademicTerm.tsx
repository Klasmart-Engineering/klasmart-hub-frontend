import { gql } from "@apollo/client";

export const CREATE_ACADEMIC_TERM = gql`
    mutation createAcademicTerm($schoolId: ID!, $name: String!, $startDate: Date!, $endDate: Date!) {
        createAcademicTerms(input: [{ schoolId: $schoolId, name: $name, startDate: $startDate, endDate: $endDate }]) {
            academicTerms {
                id
            }
        }
    }
`;
