import { RoleFilter } from "@/api/roles";
import { RoleRow } from "@/components/Role/Table";
import { ROLE_SUMMARY_NODE_FIELDS } from "@/operations/fragments";
import {
    Status,
    UuidExclusiveOperator,
    UuidOperator,
} from "@/types/graphQL";
import { isUuid } from "@/utils/pagination";
import { gql } from "@apollo/client";
import { BaseTableData } from "kidsloop-px/dist/types/components/Table/Common/BaseTable";

export const teacherStudentRoleFilter: RoleFilter = {
    AND: [
        {
            system: {
                value: true,
                operator: `eq`,
            },
        },
        {
            OR: [
                {
                    name: {
                        value: `Student`,
                        operator: `contains`,
                    },
                },
                {
                    name: {
                        value: `Teacher`,
                        operator: `contains`,
                    },
                },
            ],
        },
    ],
};

export interface RoleQueryFilter {
    organizationId: string;
    search: string;
    filters: RoleFilter[];
}

export const buildOrganizationRoleSearchFilter = (search: string): RoleFilter => ({
    ...isUuid(search)
        ? {
            id: {
                operator: `eq`,
                value: search,
            },
        }
        : {
            OR: [
                {
                    name: {
                        operator: `contains`,
                        value: search,
                        caseInsensitive: true,
                    },
                },
            ],
        },
});

export const buildOrganizationRoleFilter = (filter: RoleQueryFilter): RoleFilter => ({
    status: {
        operator: `eq`,
        value: Status.ACTIVE,
    },
    AND: [
        {
            OR: [
                {
                    organizationId: {
                        operator: `eq`,
                        value: filter.organizationId,
                    },
                },
                {
                    system: {
                        operator: `eq`,
                        value: true,
                    },
                },
            ],
        },
        {
            AND: [ buildOrganizationRoleSearchFilter(filter.search), ...filter.filters ],
        },
    ],
});

export const GET_PAGINATED_ORGANIZATION_ROLES = gql`
    query getOrganizationRoles(
        $direction: ConnectionDirection!
            $count: PageSize
            $cursor: String
            $order: SortOrder!
            $orderBy: RoleSortBy!
            $filter: RoleFilter
        ) {
            rolesConnection(
                direction: $direction
                directionArgs: { count: $count, cursor: $cursor }
                sort: { field: $orderBy, order: $order }
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
                    name
                    description
                    status
                    system
                }
            }
        }
    }
`;
