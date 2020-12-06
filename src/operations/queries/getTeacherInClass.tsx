import { gql } from "@apollo/client";

export const GET_TEACHER_IN_CLASS = gql`
    query class($class_id: ID!) {
        class(class_id: $class_id) {
            class_id
            class_name
            teachers {
                user_id
                given_name
                email
                memberships {
                    roles {
                        role_name
                    }
                }
            }
            students {
                user_id
                given_name
                email
                memberships {
                roles {
                    role_name
                }
                }
            }
        }
    }
`;
