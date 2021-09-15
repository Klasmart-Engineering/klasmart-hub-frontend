import { USER_FIELDS } from "@/operations/fragments";
import { gql } from "@apollo/client";

export const GET_CLASS_ROSTER = gql`
    ${USER_FIELDS}

    query class($class_id: ID!, $organization_id: ID!) {
        class(class_id: $class_id) {
            class_name
            students {
                ...UserFields
            }
            teachers {
                ...UserFields
            }
        }
    }
`;
