import { gql } from "@apollo/client";

export const EDIT_MEMBERSHIP_OF_ORGANIZATION = gql`
    mutation invite(
        $organization_id: ID!
        $email: String!
        $given_name: String
        $family_name: String
        $organization_role_ids: [ID!]!
        $school_ids: [ID!]
        $school_role_ids: [ID!]
    ) {
        organization(organization_id: $organization_id) {
        editMembership(
            email: $email
            given_name: $given_name
            family_name: $family_name
            organization_role_ids: $organization_role_ids
            school_ids: $school_ids
            school_role_ids: $school_role_ids
        ) {
            user {
            user_id
            }
            membership {
            roles {
                role_id
            }
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
