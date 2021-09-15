import { gql } from "@apollo/client";

export const ROLE_SUMMARY_NODE_FIELDS = gql`
    fragment RoleSummaryNodeFields on RoleSummaryNode {
        id
        organizationId
        schoolId
        name
        status
    }
`;

export const USER_FIELDS = gql`
    fragment UserFields on User {
        user_id
        full_name
        given_name
        family_name
        email
        phone
        date_of_birth
        avatar
        username
        alternate_phone
        membership(organization_id: $organization_id) {
            status
            roles {
                role_id
                role_name
                status
            }
        }
        subjectsTeaching {
            id
            name
        }
    }
`;
