import { gql } from "@apollo/client";

export const ADD_STUDENTS_TO_CLASS = gql`
    mutation addStudentsToClass($classId: ID!, $studentIds: [ID!]!) {
        addStudentsToClasses(input: [{ classId: $classId, studentIds: $studentIds }]) {
            classes {
                id
            }
        }
    }
`;
