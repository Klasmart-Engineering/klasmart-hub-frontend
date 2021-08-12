import { gql } from "@apollo/client";

export const GET_CLASS = gql`
    query getClass($id: ID!, $organizationId: ID!) {
        class(class_id: $id) {
            class_id
            class_name
            programs {
                id
                name
                subjects {
                    id
                    name
                }
            }
            teachers {
                given_name
                family_name
                full_name
                membership(organization_id: $organizationId) {
                    status
                }
            }
            students {
                given_name
                family_name
                full_name
                membership(organization_id: $organizationId) {
                    status
                }
            }
            schools {
                school_id
                school_name
                programs {
                    id
                }
            }
            grades {
                id
            }
            subjects {
                id
            }
            age_ranges {
                id
            }
        }
    }
`;
