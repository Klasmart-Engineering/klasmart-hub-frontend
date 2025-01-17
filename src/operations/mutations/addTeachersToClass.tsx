import { gql } from "@apollo/client";

export const ADD_TEACHERS_TO_CLASS = gql`
    mutation addTeachersToClass($classId: ID!, $teacherIds: [ID!]!) {
        addTeachersToClasses(input: [{ classId: $classId, teacherIds: $teacherIds }]) {
            classes {
                id
            }
        }
    }
`;
