import { gql } from "@apollo/client";

export const GET_ALL_CATEGORIES = gql`
    query organization($organization_id: ID!) {
        organization(organization_id: $organization_id) {
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
`;
