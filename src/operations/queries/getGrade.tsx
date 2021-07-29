import { gql } from "@apollo/client";

export const GET_GRADE = gql`
    query getGrade($id: ID!) {
        grade(id: $id) {
            id
            name
            status
            system
            progress_from_grade {
                id
                name
                status
                system
            }
            progress_to_grade {
                id
                name
                status
                system
            }
        }
    }
`;
