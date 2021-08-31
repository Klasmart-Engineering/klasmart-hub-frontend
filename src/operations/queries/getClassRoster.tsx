import { gql } from "@apollo/client";

export const GET_CLASS_ROSTER = gql`
    query class($class_id: ID!, $organization_id: ID!) {
        class(class_id: $class_id) {
            class_name
            students {
                user_id
                full_name
                given_name
                family_name
                email
                phone
                date_of_birth
                avatar
                username
                membership(organization_id: $organization_id) {
                    status
                }
                subjectsTeaching {
                    id
                    name
                }
            }
            teachers {
                user_id
                full_name
                given_name
                family_name
                email
                phone
                date_of_birth
                avatar
                username
                membership(organization_id: $organization_id) {
                    status
                }
                subjectsTeaching {
                    id
                    name
                }
            }
        }
    }
`;
