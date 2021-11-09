import { gql } from "@apollo/client";

export const REPLACE_ROLE = gql`
    mutation replaceRole(
        $oldRoleId: ID!,
        $newRoleId: ID!,
        $organizationId: ID!
    ) {
        replaceRole(
            old_role_id: $oldRoleId,
            new_role_id: $newRoleId,
            organization_id: $organizationId
        ) {
            role_id,
            role_name
        }
    }
`;
