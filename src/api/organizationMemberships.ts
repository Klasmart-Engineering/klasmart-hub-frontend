import {
    GetUserNodeRequest,
    GetUserNodeResponse,
    UserNode,
} from "./users";
import { DEACTIVATE_USER_IN_ORGANIZATION } from "@/operations/mutations/deactivateUser";
import { EDIT_MEMBERSHIP_OF_ORGANIZATION } from "@/operations/mutations/editMembershipOfOrganization";
import { INVITE_USER_TO_ORGANIZATION } from "@/operations/mutations/inviteUserToOrganization";
import { LEAVE_MEMBERSHIP } from "@/operations/mutations/leaveMembership";
import { REACTIVATE_USER_IN_ORGANIZATION } from "@/operations/mutations/reactivateUser";
import { GET_ORGANIZATION_MEMBERSHIPS_PERMISSIONS } from "@/operations/queries/getAllUserPermissions";
import { GET_ORGANIZATION_USER_NODE } from "@/operations/queries/getOrganizationUserNode";
import { GET_ORGANIZATION_USERS } from "@/operations/queries/getOrganizationUsers";
import { GET_PAGINATED_ORGANIZATION_USERS } from "@/operations/queries/getPaginatedOrganizationUsers";
import {
    Organization,
    OrganizationMembership,
    SortOrder,
    Status,
    StringFilter,
    UuidExclusiveFilter,
    UuidFilter,
} from "@/types/graphQL";
import { PaginationFilter } from "@/utils/pagination";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

export interface UserFilter extends PaginationFilter<UserFilter> {
    userId?: UuidFilter;
    givenName?: StringFilter;
    familyName?: StringFilter;
    avatar?: StringFilter;
    email?: StringFilter;
    phone?: StringFilter;
    organizationId?: UuidFilter;
    roleId?: UuidFilter;
    schoolId?: UuidExclusiveFilter;
    organizationUserStatus?: StringFilter;
    classId?: UuidFilter;
}

export interface UpdateOrganizationMembershipRequest {
    user_id: string;
    organization_id: string;
    email?: string | null;
    phone?: string | null;
    given_name: string;
    family_name: string;
    organization_role_ids: string[];
    school_ids?: string[];
    date_of_birth?: string;
    alternate_email?: string;
    alternate_phone?: string;
    gender: string;
    shortcode: string;
}

export interface UpdateOrganizationMembershipResponse {
}

export const useUpdateOrganizationMembership = (options?: MutationHookOptions<UpdateOrganizationMembershipResponse, UpdateOrganizationMembershipRequest>) => {
    return useMutation<UpdateOrganizationMembershipResponse, UpdateOrganizationMembershipRequest>(EDIT_MEMBERSHIP_OF_ORGANIZATION, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_USERS ],
    });
};

export interface DeleteOrganizationMembershipRequest {
    organization_id: string;
    user_id: string;
}

export interface DeleteOrganizationMembershipResponse {
}

export interface ReactivateUserInOrganizationRequest {
}
export interface DeactivateUserInOrganizationRequest {
    organization_id: string;
    user_ids: string[];
}

export interface ReactivateUserInOrganizationResponse {
}
export interface DeactivateUserInOrganizationResponse {
}

export const useDeleteOrganizationMembership = (options?: MutationHookOptions<DeleteOrganizationMembershipResponse, DeleteOrganizationMembershipRequest>) => {
    return useMutation<DeleteOrganizationMembershipResponse, DeleteOrganizationMembershipRequest>(LEAVE_MEMBERSHIP, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_USERS ],
    });
};

export const useReactivateUserInOrganization = (options?: MutationHookOptions<ReactivateUserInOrganizationResponse, ReactivateUserInOrganizationRequest>) => {
    return useMutation<ReactivateUserInOrganizationResponse, ReactivateUserInOrganizationRequest>(REACTIVATE_USER_IN_ORGANIZATION, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_USERS ],
    });
};

export const useDeactivateUserInOrganization = (options?: MutationHookOptions<DeactivateUserInOrganizationResponse, DeactivateUserInOrganizationRequest>) => {
    return useMutation<DeactivateUserInOrganizationResponse, DeactivateUserInOrganizationRequest>(DEACTIVATE_USER_IN_ORGANIZATION, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_USERS ],
    });
};

export interface CreateOrganizationMembershipRequest {
    organization_id: string;
    email?: string | null;
    phone?: string | null;
    given_name: string;
    family_name: string;
    organization_role_ids: string[];
    school_ids?: string[];
    date_of_birth?: string;
    alternate_email?: string;
    alternate_phone?: string;
    gender: string;
    shortcode?: string;
}

export interface CreateOrganizationMembershipResponse {
}

export const useCreateOrganizationMembership = (options?: MutationHookOptions<CreateOrganizationMembershipResponse, CreateOrganizationMembershipRequest>) => {
    return useMutation<CreateOrganizationMembershipResponse, CreateOrganizationMembershipRequest>(INVITE_USER_TO_ORGANIZATION, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_USERS ],
    });
};

export interface GetOrganizationMembershipRequest {
    organizationId: string;
    userId: string;
}

export interface GetOrganizationMembershipResponse {
    user: {
        membership: OrganizationMembership;
    };
}

export interface GetOrganizationUserNodeResponse {
    userNode: {
        membership: OrganizationMembership;
    };
}

export const useGetOrganizationUserNode = (options?: QueryHookOptions<GetUserNodeResponse, GetUserNodeRequest>) => {
    return useQuery<GetUserNodeResponse, GetUserNodeRequest>(GET_ORGANIZATION_USER_NODE, options);
};

interface GetOrganizationMembershipsRequest {
    organization_id: string;
}

interface GetOrganizationMembershipsResponse {
    organization: Organization;
}

export const useGetOrganizationMemberships = (options?: QueryHookOptions<GetOrganizationMembershipsResponse, GetOrganizationMembershipsRequest>) => {
    return useQuery<GetOrganizationMembershipsResponse, GetOrganizationMembershipsRequest>(GET_ORGANIZATION_USERS, options);
};

interface GetOrganizationMembershipsRequest2 {
    direction: `FORWARD` | `BACKWARD`;
    cursor?: string;
    count?: number;
    order: SortOrder;
    orderBy: string;
    filter?: UserFilter;
}

export interface OrganizationMembershipConnectionNode {
    userId?: string;
    organizationId?: string;
    status?: Status;
    shortCode?: string;
    joinTimestamp?: string;
    user?: UserNode;
    rolesConnection?: RolesConnection;
}

export interface SchoolMembershipConnectionNode {
    school: {
        id?: string;
        name?: string;
        status?: Status;
    };
}

export interface RolesConnectionNode {
    id?: string;
    name?: string;
    status?: Status;
}

export interface OrganizationMembershipsConnection {
    totalCount?: number;
    pageInfo?: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
    };
    edges: OrganizationMembershipConnectionEdge[];
}

export interface SchoolMembershipsConnection {
    totalCount?: number;
    pageInfo?: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
    };
    edges: SchoolsMembershipConnectionEdge[];
}

export interface RolesConnection {
    totalCount?: number;
    pageInfo?: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
    };
    edges: RolesConnectionEdge[];
}
export interface OrganizationMembershipConnectionEdge {
    node: OrganizationMembershipConnectionNode;
}

export interface SchoolsMembershipConnectionEdge {
    node: SchoolMembershipConnectionNode;
}

export interface RolesConnectionEdge {
    node: RolesConnectionNode;
}
export interface UserEdge {
    node: UserNode;
}

export interface GetOrganizationMembershipsResponse2 {
    usersConnection: {
        totalCount: number;
        pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string;
            endCursor: string;
        };
        edges: UserEdge[];
    };
}

export const useGetPaginatedOrganizationMemberships = (options?: QueryHookOptions<GetOrganizationMembershipsResponse2, GetOrganizationMembershipsRequest2>) => {
    return useQuery<GetOrganizationMembershipsResponse2, GetOrganizationMembershipsRequest2>(GET_PAGINATED_ORGANIZATION_USERS, options);
};

interface GetOrganizationMembershipsPermissionsRequest {
}

export interface GetOrganizationMembershipsPermissionsResponse {
    me?: {
        memberships: OrganizationMembership[];
    };
}

export const useGetOrganizationMembershipsPermissions = (options?: QueryHookOptions<GetOrganizationMembershipsPermissionsResponse, GetOrganizationMembershipsPermissionsRequest>) => {
    return useQuery<GetOrganizationMembershipsPermissionsResponse, GetOrganizationMembershipsPermissionsRequest>(GET_ORGANIZATION_MEMBERSHIPS_PERMISSIONS, options);
};
