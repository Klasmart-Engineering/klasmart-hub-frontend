import { ClassesFilter } from "./classes";
import { UserNode } from "./users";
import { REACTIVATE_BULK_USERS_IN_ORGANIZATION } from "@/operations/mutations/activateBulkUsers";
import { DEACTIVATE_BULK_USERS_IN_ORGANIZATION } from "@/operations/mutations/deactivateBulkUsers";
import { DEACTIVATE_USER_IN_ORGANIZATION } from "@/operations/mutations/deactivateUser";
import { DELETE_USER_IN_ORGANIZATION } from "@/operations/mutations/deleteUser";
import { EDIT_MEMBERSHIP_OF_ORGANIZATION } from "@/operations/mutations/editMembershipOfOrganization";
import { INVITE_USER_TO_ORGANIZATION } from "@/operations/mutations/inviteUserToOrganization";
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
    User,
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
    gradeId?: UuidFilter;
}

export interface OrganizationMembershipFilter extends PaginationFilter<OrganizationMembershipFilter> {
    organizationId: UuidFilter;
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

export interface DeleteUsersInOrganizationRequest {
    organizationId: string;
    userIds: string[];
}

export interface DeleteUsersInOrganizationResponse {
}

export interface ReactivateUsersInOrganizationRequest {
    organizationId: string;
    userIds: string[];
}
export interface DeactivateUsersInOrganizationRequest {
    organizationId: string;
    userIds: string[];
}

export interface ReactivateUsersInOrganizationResponse {
}
export interface DeactivateUsersInOrganizationResponse {
}

export interface DeactivateBulkUsersInOrganizationRequest {
    organizationId: string;
    userIds: string[];
}
export interface DeactivateBulkUsersInOrganizationResponse {
}

export interface ReactivateBulkUsersInOrganizationRequest {
    organizationId: string;
    userIds: string[];
}
export interface ReactivateBulkUsersInOrganizationResponse {
}

export const useDeleteUsersInOrganization = (options?: MutationHookOptions<DeleteUsersInOrganizationResponse, DeleteUsersInOrganizationRequest>) => {
    return useMutation<DeleteUsersInOrganizationResponse, DeleteUsersInOrganizationRequest>(DELETE_USER_IN_ORGANIZATION, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_USERS ],
    });
};

export const useReactivateUsersInOrganization = (options?: MutationHookOptions<ReactivateUsersInOrganizationResponse, ReactivateUsersInOrganizationRequest>) => {
    return useMutation<ReactivateUsersInOrganizationResponse, ReactivateUsersInOrganizationRequest>(REACTIVATE_USER_IN_ORGANIZATION, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_USERS ],
    });
};

export const useDeactivateUsersInOrganization = (options?: MutationHookOptions<DeactivateUsersInOrganizationResponse, DeactivateUsersInOrganizationRequest>) => {
    return useMutation<DeactivateUsersInOrganizationResponse, DeactivateUsersInOrganizationRequest>(DEACTIVATE_USER_IN_ORGANIZATION, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_USERS ],
    });
};

export const useDeactivateAllUsersInOrganization = (options?: MutationHookOptions<DeactivateBulkUsersInOrganizationResponse, DeactivateBulkUsersInOrganizationRequest>) => {
    return useMutation<DeactivateBulkUsersInOrganizationResponse, DeactivateBulkUsersInOrganizationRequest>(DEACTIVATE_BULK_USERS_IN_ORGANIZATION, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_USERS ],
    });
};

export const useReactivateAllUsersInOrganization = (options?: MutationHookOptions<ReactivateBulkUsersInOrganizationResponse, ReactivateBulkUsersInOrganizationRequest>) => {
    return useMutation<ReactivateBulkUsersInOrganizationResponse, ReactivateBulkUsersInOrganizationRequest>(REACTIVATE_BULK_USERS_IN_ORGANIZATION, {
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

export interface GetOrganizationUserNodeRequest {
    organizationId: string;
    userId: string;
}
export interface GetOrganizationUserNodeResponse {
    userNode: UserNode;
}

export const useGetOrganizationUserNode = (options?: QueryHookOptions<GetOrganizationUserNodeResponse, GetOrganizationUserNodeRequest>) => {
    return useQuery<GetOrganizationUserNodeResponse, GetOrganizationUserNodeRequest>(GET_ORGANIZATION_USER_NODE, options);
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
    organizationMembershipFilter: OrganizationMembershipFilter;
    classFilter: ClassesFilter;
}

export interface OrganizationContactInfo {
    phone: string;
}

export interface OrganizationConnectionNode {
    id: string;
    name: string;
    owners: {
        email: string;
        id?: string;
    }[];
    contactInfo: OrganizationContactInfo;
    branding: {
        iconImageURL: string;
        primaryColor: string;
    };
}

export interface RoleConnectionNode {
    id: string;
    name: string;
}

export interface OrganizationMembershipConnectionNode {
    userId?: string;
    organizationId?: string;
    id?: string;
    status?: Status;
    shortCode?: string;
    joinTimestamp?: string;
    user?: UserNode;
    organization?: OrganizationConnectionNode;
    rolesConnection?: RolesConnection;
}

export interface SchoolMembershipConnectionNode {
    school: {
        id?: string;
        name?: string;
        organizationId?: string;
        status?: Status;
    };
}

export interface ClassConnectionNode {
    id: string;
    name: string;
    gradesConnection: GradeConnection;
}

export interface GradeConnectionNode {
    id: string;
    name: string;
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

export interface ClassConnection {
    edges: ClassConnectionEdge[];
}

export interface GradeConnection {
    edges: GradeConnectionEdge[];
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

export interface ClassConnectionEdge {
    node: ClassConnectionNode;
}
export interface GradeConnectionEdge {
    node: GradeConnectionNode;
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
    organizationId: string;
}

export interface GetOrganizationMembershipsPermissionsResponse {
    me?: {
        membership: OrganizationMembership;
    };
}

export const useGetOrganizationMembershipsPermissions = (options?: QueryHookOptions<GetOrganizationMembershipsPermissionsResponse, GetOrganizationMembershipsPermissionsRequest>) => {
    return useQuery<GetOrganizationMembershipsPermissionsResponse, GetOrganizationMembershipsPermissionsRequest>(GET_ORGANIZATION_MEMBERSHIPS_PERMISSIONS, options);
};
