import { gql } from "@apollo/client";

export const GET_ORGANIZATION_USER = gql`
    query getOrganizationUser($userId: ID!, $organizationId: ID!) {
        user(user_id:$userId) {
            membership(organization_id: $organizationId) {
                shortcode
                user_id
                organization_id
                user {
                    given_name
                    family_name
                    email
                    gender
                    email
                    phone
                    date_of_birth
                    alternate_email
                    alternate_phone
                }
                roles {
                    role_id
                    role_name
                    status
                }
                schoolMemberships {
                    school_id
                    school {
                        school_name
                        status
                    }
                }
            }
        }
    }
`;
