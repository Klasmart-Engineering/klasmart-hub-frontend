import { gql } from "@apollo/client";

export const MOVE_TEACHERS_TO_CLASS = gql`
    mutation moveTeachersToClass($fromClassId: ID!, $toClassId: ID!, $userIds: [ID!]!) {
        moveTeachersToClass(input: { fromClassId: $fromClassId, toClassId: $toClassId, userIds: $userIds }) {
            fromClass {
                id
            }
            toClass {
                id
            }
        }
    }
`;
