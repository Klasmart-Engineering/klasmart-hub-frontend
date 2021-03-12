import { Grade } from "@/types/graphQL";
import { gql } from "@apollo/client";

export const sampleGrades: Grade[] = [
    {
        id: `1`,
        name: `PreK-0`,
        system: false,
    },
];

export const GET_GRADES = gql`
    query getGrades($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            grades {
                id
                name
                progress_from_grade{
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
