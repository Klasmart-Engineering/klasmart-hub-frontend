import { gql } from "@apollo/client";

export const ADD_USERS_TO_CLASS = gql`
    mutation addUsersToClass($classId: ID!, $studentIds: [ID!]!, $teacherIds: [ID!]!) {
        addStudentsToClasses(input: [{ classId: $classId, studentIds: $studentIds }]) {
            classes {
                id
            }
        }
        addTeachersToClasses(input: [{ classId: $classId, teacherIds: $teacherIds }]) {
            classes {
                id
            }
        }
    }
`;
