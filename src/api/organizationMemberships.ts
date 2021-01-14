import { EDIT_MEMBERSHIP_OF_ORGANIZATION } from "@/operations/mutations/editMembershipOfOrganization";
import { INVITE_USER_TO_ORGANIZATION } from "@/operations/mutations/inviteUserToOrganization";
import { LEAVE_MEMBERSHIP } from "@/operations/mutations/leaveMembership";
import { GET_ORGANIZATION_USERS } from "@/operations/queries/getOrganizationUsers";
import { Organization } from "@/types/graphQL";
import {
    useMutation,
    useQuery,
} from "@apollo/client";

interface UpdateOrganizationMembershipRequest {
    organization_id: string;
    email?: string | null;
    phone?: string | null;
    given_name?: string | null;
    family_name?: string | null;
    organization_role_ids: string[];
    school_ids: string[];
}

interface UpdateOrganizationMembershipResponse {
}

export const useUpdateOrganizationMembership = () => {
    return useMutation<UpdateOrganizationMembershipResponse, UpdateOrganizationMembershipRequest>(EDIT_MEMBERSHIP_OF_ORGANIZATION);
    // return [
    //     async (membership: OrganizationMembership) => {
    //         const {
    //             organization_id,
    //             user,
    //             roles,
    //             schoolMemberships,
    //         } = membership;
    //         const roleIds = roles?.map((r) => r.role_id) ?? [];
    //         const schoolIds = schoolMemberships?.map((s) => s.school_id) ?? [];
    //         return promise({
    //             variables: {
    //                 organization_id,
    //                 email: user?.email,
    //                 phone: user?.phone,
    //                 given_name: user?.given_name,
    //                 family_name: user?.family_name,
    //                 organization_role_ids: roleIds,
    //                 school_ids: schoolIds,
    //             },
    //         });
    //     },
    //     mutationResult,
    // ];
};

interface DeleteOrganizationMembershipRequest {
    organization_id: string;
    user_id: string;
}

interface DeleteOrganizationMembershipResponse {
}

export const useDeleteOrganizationMembership = () => {
    return useMutation<DeleteOrganizationMembershipResponse, DeleteOrganizationMembershipRequest>(LEAVE_MEMBERSHIP);
};

interface CreateOrganizationMembershipRequest {
    organization_id: string;
    email?: string | null;
    phone?: string | null;
    given_name?: string | null;
    family_name?: string | null;
    organization_role_ids: string[];
    school_ids: string[];
}

interface CreateOrganizationMembershipResponse {
}

export const useCreateOrganizationMembership = () => {
    return useMutation<CreateOrganizationMembershipResponse, CreateOrganizationMembershipRequest>(INVITE_USER_TO_ORGANIZATION);
};

interface GetOrganizationMembershipsRequest {
    organization_id: string;
}

interface GetOrganizationMembershipsResponse {
    organization: Organization;
}

export const useGetOrganizationMemberships = (organizationId: string) => {
    return useQuery<GetOrganizationMembershipsResponse, GetOrganizationMembershipsRequest>(GET_ORGANIZATION_USERS, {
        fetchPolicy: `network-only`,
        variables: {
            organization_id: organizationId,
        },
    });
};
