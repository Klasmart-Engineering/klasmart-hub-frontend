import { gql } from "@apollo/client";

export const GET_ORGANIZATIONS = gql`
    query {
        me {
        email
        memberships {
            organization {
            organization_id
            organization_name
            phone
            owner {
                email
            }
            }
            roles {
            role_id
            role_name
            }
        }
        }
    }
`;
