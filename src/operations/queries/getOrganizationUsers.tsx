import { gql } from "@apollo/client";

export const GET_ORGANIZATION_USERS = gql`
    query organization($organization_id: ID!) {
        organization(organization_id: $organization_id) {
        organization_name
        schools {
            school_id
            school_name
            memberships {
            school_id
            join_timestamp
            user {
                user_id
                user_name
                email
                avatar
            }
            roles {
                role_id
                role_name
            }
            }
        }
        memberships {
            join_timestamp
            user {
            user_id
            given_name
            family_name
            email
            avatar
            school_memberships {
                school {
                school_id
                school_name
                }
                roles {
                role_id
                role_name
                }
                school_id
            }
            }
            roles {
            role_id
            role_name
            }
        }
        roles {
            role_id
            role_name
        }
        }
    }
`;
