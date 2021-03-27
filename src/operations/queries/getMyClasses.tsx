import { gql } from "@apollo/client";

export const GET_MY_CLASSES = gql`
  query me {
    me {
      user_id
      full_name
      classesStudying {
        class_id
        class_name
        schools {
          school_id
          school_name
        }
        organization {
          organization_id
          organization_name
        }
      }
      classesTeaching {
        class_id
        class_name
        schools {
          school_id
          school_name
        }
        organization {
          organization_id
          organization_name
        }
      }
    }
  }
`;
