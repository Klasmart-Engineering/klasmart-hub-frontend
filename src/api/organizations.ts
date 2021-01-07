import { DELETE_ORGANIZATION } from "@/operations/mutations/deleteOrganization";
import { LEAVE_MEMBERSHIP } from "@/operations/mutations/leaveMembership";
import { GET_ORGANIZATION_OWNERSHIPS } from "@/operations/queries/getMyOrganization";
import { GET_ORGANIZATIONS } from "@/operations/queries/getOrganizations";
import { User } from "@/types/graphQL";
import { useMutation, useQuery } from "@apollo/client";

interface GetOrganizationsRequest {}

interface GetOrganizationsResponse {
    me: User;
}

export const useGetOrganizations = () => {
    return useQuery<GetOrganizationsResponse, GetOrganizationsRequest>(
        GET_ORGANIZATIONS,
        {
            fetchPolicy: "network-only",
        },
    );
};

interface LeaveMembershipRequest {
    organization_id: string;
    user_id: string;
}

export const useLeaveMembership = () => {
    return useMutation<LeaveMembershipRequest>(LEAVE_MEMBERSHIP);
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
        fetchPolicy: "network-only",
    });
};

interface DeleteOrganizationRequest {
    organization_id: string;
}

export const useDeleteOrganizationOwnership = () => {
    return useMutation<DeleteOrganizationRequest>(DELETE_ORGANIZATION);
};
