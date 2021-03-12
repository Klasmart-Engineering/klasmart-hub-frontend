import { gql } from "@apollo/client";

export const CREATE_OR_UPDATE_SUBJECTS = gql`
    mutation organization($organization_id: ID!, $subjects: [SubjectDetail]!) {
        organization(organization_id: $organization_id) {
            createOrUpdateSubjects(subjects: $subjects) {
                id
            }
        }
    }
`;
