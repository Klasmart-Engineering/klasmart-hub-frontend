import { gql } from "@apollo/client";

export const MOVE_STUDENTS_TO_CLASS = gql`
    mutation moveStudentsToClass($fromClassId: ID!, $toClassId: ID!, $userIds: [ID!]!) {
        moveStudentsToClass(input: { fromClassId: $fromClassId, toClassId: $toClassId, userIds: $userIds }) {
            fromClass {
                id
            }
            toClass {
                id
            }
        }
    }
`;
