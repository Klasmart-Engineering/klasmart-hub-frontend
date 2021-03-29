import { gql } from "@apollo/client";

export const INVITE_USER_TO_ORGANIZATION = gql`
    mutation invite(
        $organization_id: ID!
        $email: String
        $phone: String
        $given_name: String
        $family_name: String
        $organization_role_ids: [ID!]!
        $school_ids: [ID!]
        $school_role_ids: [ID!]
        $date_of_birth: String
        $alternate_email: String
        $alternate_phone: String
        $gender: String
        $shortcode: String
    ) {
        organization(organization_id: $organization_id) {
            inviteUser(
                email: $email
                phone: $phone
                given_name: $given_name
                family_name: $family_name
                organization_role_ids: $organization_role_ids
                school_ids: $school_ids
                school_role_ids: $school_role_ids
                date_of_birth: $date_of_birth
                alternate_email: $alternate_email
                alternate_phone: $alternate_phone
                gender: $gender
                shortcode: $shortcode
            ) {
                user {
                    user_id
                    gender
                    alternate_email
                    date_of_birth
                }
                membership {
                    roles {
                        role_id
                    }
                    shortcode
                }
                schoolMemberships {
                    school_id
                    roles {
                        role_id
                    }
                }
            }
        }
    }
`;
