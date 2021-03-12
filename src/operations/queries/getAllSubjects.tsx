import { gql } from "@apollo/client";

export const GET_ALL_SUBJECTS = gql`
    query organization($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            subjects {
                id
                name
                system
                status
                categories {
                    id
                    name
                    system
                    status
                    subcategories {
                        id
                        name
                        system
                        status
                    }
                }
            }
        }
    }
`;
