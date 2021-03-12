import { gql } from "@apollo/client";

export const CREATE_UPDATE_GRADES = gql`
    mutation createUpdateGrades($organization_id: ID!, $grades: [GradeDetail]!) {
        organization(organization_id: $organization_id) {
            createOrUpdateGrades(grades: $grades) {
                id
                name
                progress_from_grade {
                    id
                    name
                }
                progress_to_grade {
                    id
                    name
                }
                system
                status
            }
        }
    }
`;
