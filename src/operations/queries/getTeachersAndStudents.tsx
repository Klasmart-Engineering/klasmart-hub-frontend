import { gql } from "@apollo/client";

export const GET_TEACHERS_AND_STUDENTS = gql`
  query organization($organization_id: ID!) {
    organization(organization_id: $organization_id) {
      teachers: membersWithPermission(permission_name: "can_teach") {
        roles {
          role_name
        }
        user {
          user_id
          user_name
          email
        }
      }
      students: membersWithPermission(permission_name: "can_study") {
        roles {
          role_name
        }
        user {
          user_id
          user_name
          email
        }
      }
    }
  }
`;
