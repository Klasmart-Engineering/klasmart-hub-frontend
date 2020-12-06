import { gql } from "@apollo/client";

export const CREATE_CLASS = gql`
    mutation organization(
        $organization_id: ID!
        $class_name: String
        $school_ids: [ID!]
    ) {
        organization(organization_id: $organization_id) {
        createClass(class_name: $class_name) {
            class_id
            class_name
            editSchools(school_ids: $school_ids) {
            school_id
            school_name
            }
        }
        }
    }
`;
