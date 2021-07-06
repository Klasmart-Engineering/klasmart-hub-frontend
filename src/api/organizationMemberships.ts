import { EDIT_MEMBERSHIP_OF_ORGANIZATION } from "@/operations/mutations/editMembershipOfOrganization";
import { INVITE_USER_TO_ORGANIZATION } from "@/operations/mutations/inviteUserToOrganization";
import { LEAVE_MEMBERSHIP } from "@/operations/mutations/leaveMembership";
import { GET_ORGANIZATION_MEMBERSHIPS_PERMISSIONS } from "@/operations/queries/getAllUserPermissions";
import { GET_ORGANIZATION_USER } from "@/operations/queries/getOrganizationUser";
import { GET_ORGANIZATION_USERS } from "@/operations/queries/getOrganizationUsers";
import { GET_PAGINATED_ORGANIZATION_USERS } from "@/operations/queries/getPaginatedOrganizationUsers";
import {
    Organization,
    OrganizationMembership,
    SortOrder,
} from "@/types/graphQL";
import {
    MutationHookOptions,
    QueryHookOptions,
    useLazyQuery,
    useMutation,
    useQuery,
} from "@apollo/client";

interface UpdateOrganizationMembershipRequest {
    user_id: string;
    organization_id: string;
    email?: string | null;
    phone?: string | null;
    given_name?: string | null;
    family_name?: string | null;
    organization_role_ids?: string[];
    school_ids?: string[];
    date_of_birth?: string;
    alternate_email?: string;
    alternate_phone?: string;
    gender?: string;
    shortcode?: string;
}

interface UpdateOrganizationMembershipResponse {
}

export const useUpdateOrganizationMembership = (options?: MutationHookOptions<UpdateOrganizationMembershipResponse, UpdateOrganizationMembershipRequest>) => {
    return useMutation<UpdateOrganizationMembershipResponse, UpdateOrganizationMembershipRequest>(EDIT_MEMBERSHIP_OF_ORGANIZATION, options);
};

interface DeleteOrganizationMembershipRequest {
    organization_id: string;
    user_id: string;
}

interface DeleteOrganizationMembershipResponse {
}

export const useDeleteOrganizationMembership = (options?: MutationHookOptions<DeleteOrganizationMembershipResponse, DeleteOrganizationMembershipRequest>) => {
    return useMutation<DeleteOrganizationMembershipResponse, DeleteOrganizationMembershipRequest>(LEAVE_MEMBERSHIP, options);
};

interface CreateOrganizationMembershipRequest {
    organization_id: string;
    email?: string | null;
    phone?: string | null;
    given_name?: string | null;
    family_name?: string | null;
    organization_role_ids: string[];
    school_ids: string[];
    date_of_birth: string;
    alternate_email: string;
    alternate_phone: string;
    gender: string;
    shortcode: string;
}

interface CreateOrganizationMembershipResponse {
}

export const useCreateOrganizationMembership = (options?: MutationHookOptions<CreateOrganizationMembershipResponse, CreateOrganizationMembershipRequest>) => {
    return useMutation<CreateOrganizationMembershipResponse, CreateOrganizationMembershipRequest>(INVITE_USER_TO_ORGANIZATION, options);
};

interface GetOrganizationMembershipRequest {
    organizationId: string;
    userId: string;
}

interface GetOrganizationMembershipResponse {
    user: {
        membership: OrganizationMembership;
    };
}

export const useGetOrganizationMembership = (options?: QueryHookOptions<GetOrganizationMembershipResponse, GetOrganizationMembershipRequest>) => {
    return useLazyQuery<GetOrganizationMembershipResponse, GetOrganizationMembershipRequest>(GET_ORGANIZATION_USER, options);
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
    search?: string;
    organizationId: string;
    order: SortOrder;
    orderBy: string;
}

export interface UserEdge {
    node: {
        id: string;
        avatar: string | null;
        contactInfo: {
            email: string | null;
            phone: string | null;
        };
        givenName: string | null;
        familyName: string | null;
        organizations: {
            userStatus: string;
            joinDate: string;
        }[];
        roles: {
            id: string;
            name: string;
            status: string;
        }[];
        schools: {
            id: string;
            name: string;
            status: string;
        }[];
    };
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

interface GetOrganizationMembershipsPermissionsResponse {
    me: {
        memberships: OrganizationMembership[];
    };
}

export const useGetOrganizationMembershipsPermissions = (options?: QueryHookOptions<GetOrganizationMembershipsPermissionsResponse, GetOrganizationMembershipsPermissionsRequest>) => {
    return useQuery<GetOrganizationMembershipsPermissionsResponse, GetOrganizationMembershipsPermissionsRequest>(GET_ORGANIZATION_MEMBERSHIPS_PERMISSIONS, options);
};
