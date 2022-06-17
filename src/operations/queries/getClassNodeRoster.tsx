import { USER_NODE_FIELDS } from "../fragments";
import { UserFilter } from "@/api/organizationMemberships";
import { Status } from "@/types/graphQL";
import { gql } from "@apollo/client";

export const buildClassNodeUserSearchFilter = (search: string): UserFilter => ({
    AND: [
        {
            organizationUserStatus: {
                operator: `eq`,
                value: Status.ACTIVE,
            }
        }
    ],
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
        }
    ],
});

export const GET_CLASS_NODE_ROSTER = gql`
    ${USER_NODE_FIELDS}
    query getClassNodeRoster(
        $id: ID!
        $count: PageSize
        $direction: ConnectionDirection!
        $orderBy: [UserSortBy!]!
        $order: SortOrder!
        $cursor: String
        $showStudents: Boolean!
        $showTeachers: Boolean!
        $filter: UserFilter
    ) {
        classNode(id: $id) {
            name
            schools {
                id
            }
            studentsConnection (
                count: $count
                direction: $direction
                cursor: $cursor
                sort: { field: $orderBy, order: $order }
                filter: $filter
            ) @include(if: $showStudents) {
                edges {
                    node {
                        ...UserNodeFields
                    }
                }
                totalCount
                pageInfo {
                    startCursor
                    endCursor
                    hasNextPage
                    hasPreviousPage
                }
            }
            teachersConnection(
                count: $count
                direction: $direction
                cursor: $cursor
                sort: { field: $orderBy, order: $order }
                filter: $filter
            ) @include(if: $showTeachers) {
                edges {
                    node {
                        ...UserNodeFields
                    }
                }
                totalCount
                pageInfo {
                    startCursor
                    endCursor
                    hasNextPage
                    hasPreviousPage
                }
            }
        }
    }
`;
