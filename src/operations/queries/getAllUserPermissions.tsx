import { gql } from "@apollo/client";

export const GET_ORGANIZATION_MEMBERSHIPS_PERMISSIONS = gql`
query($organizationId: ID!) {
    me {
        membership(organization_id: $organizationId) {
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
