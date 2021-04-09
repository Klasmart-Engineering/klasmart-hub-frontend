import { gql } from "@apollo/client";

export const ADD_USER_TO_ORGANIZATION = gql`
    mutation organization($organization_id: ID!, $user_id: ID!) {
        organization(organization_id: $organization_id) {
            addUser(user_id: $user_id) {
                user_id
                organization_id
                organization {
                    organization_id
                    organization_name
                    status
                }
                user {
                    user_id
                    given_name
                    family_name
                    email
                    phone
                    avatar
                }
                roles {
                    role_id
                    role_name
                }
            }
        }
    }
`;
