import { gql } from "@apollo/client";

export const GET_USER_SCHOOL_MEMBERSHIPS = gql`
    query user($user_id: ID!, $organization_id: ID!) {
        user(user_id: $user_id) {
            user_id
            membership(organization_id: $organization_id) {
                roles {
                    role_id
                    role_name
                    system_role
                }
                schoolMemberships {
                    school_id
                    school {
                        school_id
                        school_name
                    }
                }
            }
        }
    }
`;
