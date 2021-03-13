import { gql } from "@apollo/client";

export const CREATE_OR_UPDATE_PROGRAMS = gql`
    mutation organization($organization_id: ID!, $programs: [ProgramDetail]!) {
        organization(organization_id: $organization_id) {
            createOrUpdatePrograms(programs: $programs) {
                id
            }
        }
    }
`;
