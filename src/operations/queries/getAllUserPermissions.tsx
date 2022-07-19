import { gql } from "@apollo/client";

export const GET_ORGANIZATION_MEMBERSHIPS_PERMISSIONS = gql`
    query(
        $organizationId: ID! 
        $cursor: String
        $filter: PermissionFilter
    ) {
        myUser {
            permissionsInOrganization(
                organizationId: $organizationId 
                cursor: $cursor
                filter: $filter
            ) {
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    endCursor
                }
                edges {
                    node {
                        id
                    }
                }
            }
        }
    }
`;
