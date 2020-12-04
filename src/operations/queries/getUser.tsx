import { gql } from "@apollo/client";

export const GET_USER = gql`
  query user($user_id: ID!) {
    user(user_id: $user_id) {
      user_id
      user_name
      email
      avatar
      memberships {
        user_id
        organization_id
        join_timestamp
        roles {
          role_id
          role_name
        }
        organization {
          organization_id
          organization_name
          address1
          shortCode
          phone
          roles {
            role_id
            role_name
          }
          students {
            user_id
            user {
              user_id
            }
          }
          owner {
            user_id
            user_name
            email
          }
        }
      }
      my_organization {
        organization_id
        organization_name
        phone
      }
    }
  }
`;
