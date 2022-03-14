import { CREATE_NEW_ROLE } from "@/operations/mutations/createNewRole";
import { DELETE_ROLE } from "@/operations/mutations/deleteRole";
import { EDIT_ROLE } from "@/operations/mutations/editRole";
import { REPLACE_ROLE } from "@/operations/mutations/replaceRole";
import { GET_ORGANIZATION_ROLES } from "@/operations/queries/getOrganizationRoles";
import { GET_ORGANIZATION_ROLES_PERMISSIONS } from "@/operations/queries/getOrganizationRolesPermissions";
import { GET_ORGANIZATION_MEMBERSHIPS } from "@/operations/queries/getOrganizations";
import { GET_PAGINATED_ORGANIZATION_ROLES } from "@/operations/queries/getPaginatedOrganizationRoles";
import { GET_ROLE_PERMISSIONS } from "@/operations/queries/getRolePermissions";
import {
    BooleanFilter,
    Organization,
    PaginationDirection,
    Role,
    Status,
    StringFilter,
    UuidFilter,
} from "@/types/graphQL";
import { PaginationFilter } from "@/utils/pagination";
import {
    InternalRefetchQueriesInclude,
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

export interface RoleFilter extends PaginationFilter<RoleFilter> {
    id?: UuidFilter;
    name?: StringFilter;
    description?: StringFilter;
    status?: StringFilter;
    system?: BooleanFilter;
    organizationId?: UuidFilter;
}

export interface GetAllRolesRequest {
    organization_id: string;
}

export interface GetAllRolesResponse {
    organization: {
        roles: Role[];
    };
}

export interface RoleFilter extends PaginationFilter<RoleFilter> {
    id?: UuidFilter;
    name?: StringFilter;
    system?: BooleanFilter;
}

export interface RoleNode {
    id: string;
    name: string;
    description: string;
    system: boolean;
    status?: Status;
}

export interface RoleEdge {
    node: RoleNode;
}

export interface GetOrganizationPaginatedRolesRequest {
    direction: PaginationDirection;
    cursor?: string | null;
    count?: number;
    search?: string;
    orderBy?: string;
    order?: string;
    filter?: RoleFilter;
}

export interface GetOrganizationPaginatedRolesResponse {
    rolesConnection: {
        totalCount: number;
        pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string;
            endCursor: string;
        };
        edges: RoleEdge[];
    };
}

export interface RoleSummaryNode {
    id: string;
    name: string;
    status: Status;
    organizationId: string | null;
    schoolId: string | null;
}

export const useGetOrganizationRoles = (options?: QueryHookOptions<GetAllRolesResponse, GetAllRolesRequest>) => {
    return useQuery<GetAllRolesResponse, GetAllRolesRequest>(GET_ORGANIZATION_ROLES, options);
};

export const useGetPaginatedOrganizationRoles = (options?: QueryHookOptions<GetOrganizationPaginatedRolesResponse, GetOrganizationPaginatedRolesRequest>) => {
    return useQuery<GetOrganizationPaginatedRolesResponse, GetOrganizationPaginatedRolesRequest>(GET_PAGINATED_ORGANIZATION_ROLES, options);
};

export const useGetOrganizationRolesPermissions = (organizationId: string) => {
    return useQuery(GET_ORGANIZATION_ROLES_PERMISSIONS, {
        fetchPolicy: `network-only`,
        variables: {
            organization_id: organizationId,
        },
    });
};

interface CreateRoleResponse {
    organization: Organization;
}

interface CreateRoleRequest {
    organization_id: string;
    role_name: string;
    role_description: string;
    permission_names: string[];
}

export const useCreateRole = (options?: MutationHookOptions<CreateRoleResponse, CreateRoleRequest>) => {
    const refetchQueries: InternalRefetchQueriesInclude = options?.refetchQueries as InternalRefetchQueriesInclude ?? [];
    return useMutation<CreateRoleResponse, CreateRoleRequest>(CREATE_NEW_ROLE, {
        ...options,
        refetchQueries: [ GET_ORGANIZATION_MEMBERSHIPS, ...refetchQueries ],
    });
};

interface DeleteRoleRequest {
    role_id: string;
}

interface DeleteRoleResponse {
    role: Role;
}

export const useDeleteRole = (options?: MutationHookOptions<DeleteRoleResponse, DeleteRoleRequest>) => {
    const refetchQueries: InternalRefetchQueriesInclude = options?.refetchQueries as InternalRefetchQueriesInclude ?? [];
    return useMutation<DeleteRoleResponse, DeleteRoleRequest>(DELETE_ROLE, {
        ...options,
        refetchQueries: [ GET_ORGANIZATION_MEMBERSHIPS, ...refetchQueries ],
    });
};

interface ReplaceRoleRequest {
    oldRoleId: string;
    newRoleId: string;
    organizationId: string;
}

interface ReplaceRoleResponse {
    role: Role;
}

export const useReplaceRole = (options?: MutationHookOptions<ReplaceRoleResponse, ReplaceRoleRequest>) => {
    const refetchQueries: InternalRefetchQueriesInclude = options?.refetchQueries as InternalRefetchQueriesInclude ?? [];
    return useMutation<ReplaceRoleResponse, ReplaceRoleRequest>(REPLACE_ROLE, {
        ...options,
        refetchQueries: [ GET_ORGANIZATION_MEMBERSHIPS, ...refetchQueries ],
    });
};

interface GetRolePermissionsRequest {
    role_id: string;
}

export interface GetRolePermissionsResponse {
    role: Role;
}

export const useGetRolePermissions = (options?: QueryHookOptions<GetRolePermissionsResponse, GetRolePermissionsRequest>) => {
    return useQuery<GetRolePermissionsResponse, GetRolePermissionsRequest>(GET_ROLE_PERMISSIONS, options);
};

interface EditRoleRequest {
    role_id: string;
    role_name: string;
    role_description: string;
    permission_names: string[];
}

interface EditRoleResponse {
    role: Role;
}

export const useEditRole = (options?: MutationHookOptions<EditRoleResponse, EditRoleRequest>) => {
    const refetchQueries: InternalRefetchQueriesInclude = options?.refetchQueries as InternalRefetchQueriesInclude ?? [];
    return useMutation<EditRoleResponse, EditRoleRequest>(EDIT_ROLE, {
        ...options,
        refetchQueries: [ GET_ORGANIZATION_MEMBERSHIPS, ...refetchQueries ],
    });
};
