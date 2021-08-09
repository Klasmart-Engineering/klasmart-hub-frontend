import { UserFilter } from "@/api/organizationMemberships";
import { ROLE_SUMMARY_NODE_FIELDS } from "@/operations/fragments";
import { isUuid } from "@/utils/pagination";
import { gql } from "@apollo/client";

export interface ProgramQueryFilter {
    organizationId: string;
    search: string;
}

export const buildOrganizationUserSearchFilter = (search: string): UserFilter => ({
    ...isUuid(search)
        ? {
            userId: {
                operator: `eq`,
                value: search,
            },
        }
        : {
            OR: [
                {
                    givenName: {
                        operator: `contains`,
                        value: search,
                        caseInsensitive: true,
                    },
                },
                {
                    familyName: {
                        operator: `contains`,
                        value: search,
                        caseInsensitive: true,
                    },
                },
                {
                    email: {
                        operator: `contains`,
                        caseInsensitive: true,
                        value: search,
                    },
                },
                {
                    phone: {
                        operator: `contains`,
                        caseInsensitive: true,
                        value: search,
                    },
                },
            ],
        },
});

export const buildOrganizationUserFilter = (filter: ProgramQueryFilter): UserFilter => ({
    organizationId: {
        operator: `eq`,
        value: filter.organizationId,
    },
    AND: [ buildOrganizationUserSearchFilter(filter.search) ],
});

export const GET_PAGINATED_ORGANIZATION_USERS = gql`
    ${ROLE_SUMMARY_NODE_FIELDS}
    
    query getOrganizationUsers(
        $direction: ConnectionDirection!
            $count: Int
            $cursor: String
            $order: SortOrder!
            $orderBy: UserSortBy!
            $filter: UserFilter
        ) {
            usersConnection(
                direction: $direction
                directionArgs: { count: $count, cursor: $cursor }
                sort: { field: [$orderBy], order: $order }
                filter: $filter
            ) {
                totalCount
                pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            edges {
                node {
                    id
                    givenName
                    familyName
                    avatar
                    status
                    organizations {
                        name
                        userStatus
                        joinDate
                    }
                    schools {
                        id
                        name
                        status
                    }
                    roles {
                        ...RoleSummaryNodeFields
                    }
                    contactInfo {
                        email
                        phone
                    }
                }
            }
        }
    }
`;
