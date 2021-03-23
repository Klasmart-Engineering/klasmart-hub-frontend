import { gql } from "@apollo/client";

export const GET_ALL_USER_PERMISSIONS = gql`
query {
    me {
        memberships {
            organization_id
            roles {
                permissions {
                    permission_id
                }
            }
        }
    }
}
`;
