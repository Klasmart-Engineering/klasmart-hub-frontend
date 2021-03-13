import { gql } from "@apollo/client";

export const ADD_USERS_TO_CLASS = gql`
    mutation class($class_id: ID!, $student_ids: [ID!], $teacher_ids: [ID!]) {
        class(class_id: $class_id) {
            editStudents(student_ids: $student_ids) {
                user_id
            }
            editTeachers(teacher_ids: $teacher_ids) {
                user_id
            }
        }
    }
`;
