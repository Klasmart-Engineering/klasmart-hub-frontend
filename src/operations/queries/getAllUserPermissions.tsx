import { gql } from "@apollo/client";

export const GET_ORGANIZATION_MEMBERSHIPS_PERMISSIONS = gql`
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
