import { gql } from "@apollo/client";

export const ME = gql`
  query me {
    me {
      avatar
      email
      user_id
      user_name
    }
  }
`;
