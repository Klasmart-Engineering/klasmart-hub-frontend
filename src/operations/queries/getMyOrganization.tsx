import { gql } from "@apollo/client";

export const GET_ORGANIZATION_OWNERSHIPS = gql`
    query me {
        me {
            user_id
            user_name
            organization_ownerships {
                status
                organization {
                    organization_id
                    organization_name
                    phone
                    roles {
                        role_id
                        role_name
                        status
                    }
                }
                user {
                    email
                }
            }
        }
    }
`;
