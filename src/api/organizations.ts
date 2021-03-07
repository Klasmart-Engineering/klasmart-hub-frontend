import { DELETE_ORGANIZATION } from "@/operations/mutations/deleteOrganization";
import { LEAVE_MEMBERSHIP } from "@/operations/mutations/leaveMembership";
import { GET_ALL_ORGANIZATIONS } from "@/operations/queries/getAllOrganizations";
import { GET_ORGANIZATION_OWNERSHIPS } from "@/operations/queries/getMyOrganization";
import { GET_ORGANIZATION } from "@/operations/queries/getOrganization";
import { GET_ORGANIZATIONS } from "@/operations/queries/getOrganizations";
import {
    Organization,
    User,
} from "@/types/graphQL";
import {
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface GetOrganizationRequest {
    organization_id: string;
}

interface GetOrganizationResponse {
    organization: Organization;
}

export const useGetOrganization = (options?: QueryHookOptions<GetOrganizationResponse, GetOrganizationRequest>) => {
    return useQuery<GetOrganizationResponse, GetOrganizationRequest>(GET_ORGANIZATION, options);
};

interface GetOrganizationsRequest {}

interface GetOrganizationsResponse {
    me: User;
}

export const useGetOrganizations = (options?: QueryHookOptions<GetOrganizationsResponse, GetOrganizationsRequest>) => {
    return useQuery<GetOrganizationsResponse, GetOrganizationsRequest>(GET_ORGANIZATIONS, options);
};

interface GetAllOrganizationsRequest {}

interface GetAllOrganizationsResponse {
    organizations: Organization[];
}

export const useGetAllOrganizations = (options?: QueryHookOptions<GetAllOrganizationsResponse, GetAllOrganizationsRequest>) => {
    return useQuery<GetAllOrganizationsResponse, GetAllOrganizationsRequest>(GET_ALL_ORGANIZATIONS, options);
};

interface LeaveMembershipRequest {
    organization_id: string;
    user_id: string;
}

interface LeaveMembershipResponse {
    user: User;
}

export const useLeaveMembership = () => {
    return useMutation<LeaveMembershipResponse, LeaveMembershipRequest>(LEAVE_MEMBERSHIP);
};

interface GetOrganizationOwnershipsRequest {
    user_id: string;
}

interface GetOrganizationOwnershipsResponse {
    me: User;
}

export const useGetOrganizationOwnerships = () => {
    return useQuery<
        GetOrganizationOwnershipsResponse,
        GetOrganizationOwnershipsRequest
    >(GET_ORGANIZATION_OWNERSHIPS, {
        fetchPolicy: `network-only`,
    });
};

interface DeleteOrganizationRequest {
    organization_id: string;
}

interface DeleteOrganizationResponse {
    organization: Organization;
}

export const useDeleteOrganizationOwnership = () => {
    return useMutation<DeleteOrganizationResponse, DeleteOrganizationRequest>(DELETE_ORGANIZATION);
};
