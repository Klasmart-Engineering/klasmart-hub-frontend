import { gql } from "@apollo/client";

export const GET_ORGANIZATION_USERS = gql`
    query organization($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            organization_name
            schools {
                school_id
                school_name
                status
                memberships {
                    school_id
                    join_timestamp
                    status
                    user {
                        user_id
                        user_name
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
            memberships {
                organization_id
                user_id
                join_timestamp
                status
                shortcode
                schoolMemberships {
                    school {
                        school_id
                        school_name
                        status
                    }
                    roles {
                        role_id
                        role_name
                    }
                    school_id
                }
                user {
                    user_id
                    given_name
                    family_name
                    email
                    phone
                    avatar
                    full_name
                    gender
                    alternate_email
                    date_of_birth
                    alternate_phone
                }
                roles {
                    role_id
                    role_name
                    status
                }
            }
            roles {
                role_id
                role_name
                status
            }
        }
    }
`;
