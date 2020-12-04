import { gql } from "@apollo/client";

export const GET_MY_ORGANIZATION = gql`
  query user($user_id: ID!) {
    user(user_id: $user_id) {
      user_id
      user_name
      my_organization {
        organization_id
        organization_name
        phone
        owner {
          email
        }
        roles {
          role_id
          role_name
        }
      }
    }
  }
`;
