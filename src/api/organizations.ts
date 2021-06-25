import { ADD_USER_TO_ORGANIZATION } from "@/operations/mutations/addUserToOrganization";
import { CREATE_ORGANIZATION } from "@/operations/mutations/createOrganization";
import { DELETE_ORGANIZATION } from "@/operations/mutations/deleteOrganization";
import { DELETE_ORGANIZATION_BRANDING_IMAGE } from "@/operations/mutations/deleteOrganizationBrandingImage";
import { DELETE_ORGANIZATION_BRANDING_PRIMARY_COLOR } from "@/operations/mutations/deleteOrganizationBrandingPrimaryColor";
import { LEAVE_MEMBERSHIP } from "@/operations/mutations/leaveMembership";
import { SAVE_ORGANIZATION } from "@/operations/mutations/saveOrganization";
import { SET_ORGANIZATION_BRANDING } from "@/operations/mutations/setOrganizationBranding";
import { GET_ALL_ORGANIZATIONS } from "@/operations/queries/getAllOrganizations";
import { GET_ORGANIZATION_OWNERSHIPS } from "@/operations/queries/getMyOrganization";
import { GET_ORGANIZATION } from "@/operations/queries/getOrganization";
import { GET_ORGANIZATION_MEMBERSHIPS } from "@/operations/queries/getOrganizations";
import {
    Organization,
    OrganizationMembership,
    User,
} from "@/types/graphQL";
import {
    ApolloError,
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface GetOrganizationRequest {
    organization_id?: string;
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

export const useGetOrganizationMemberships = (options?: QueryHookOptions<GetOrganizationsResponse, GetOrganizationsRequest>) => {
    return useQuery<GetOrganizationsResponse, GetOrganizationsRequest>(GET_ORGANIZATION_MEMBERSHIPS, options);
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

interface CreateOrganizationRequest {

}

interface CreateOrganizationResponse {
    user: {
        createOrganization: {
            organization_id: string;
            organization_name: string;
        } | null;
        errors?: ApolloError[];
    };
}

export const useCreateOrganization = (options?: MutationHookOptions<CreateOrganizationResponse, CreateOrganizationRequest>) => {
    return useMutation<CreateOrganizationResponse, CreateOrganizationRequest>(CREATE_ORGANIZATION, options);
};

interface AddUserToOrganizationRequest {

}

interface AddUserToOrganizationResponse {
    organization: {
        addUser: OrganizationMembership;
    };
}

export const useAddUserToOrganization = (options?: MutationHookOptions<AddUserToOrganizationResponse, AddUserToOrganizationRequest>) => {
    return useMutation<AddUserToOrganizationResponse, AddUserToOrganizationRequest>(ADD_USER_TO_ORGANIZATION, options);
};
interface SaveOrganizationRequest {
    organization_id: string | undefined;
    organization_name: string;
    phone: string;
    shortCode: string;
    address1: string;
    address2: string | null;
}

interface SaveOrganizationResponse {
    organization: Organization;
}

export const useSaveOrganization = (options?: MutationHookOptions<SaveOrganizationResponse, SaveOrganizationRequest>) => {
    return useMutation<SaveOrganizationResponse, SaveOrganizationRequest>(SAVE_ORGANIZATION, options);
};

interface SetOrganizationBrandingRequest {
    organizationId: string;
    organizationLogo?: File;
    primaryColor?: string;
}

interface SetOrganizationBrandingResponse {
    iconImageURL: string | null;
    primaryColor: string | null;
}

export const useSetOrganizationBranding = (options?: MutationHookOptions<SetOrganizationBrandingResponse, SetOrganizationBrandingRequest>) => {
    return useMutation<SetOrganizationBrandingResponse, SetOrganizationBrandingRequest>(SET_ORGANIZATION_BRANDING, options);
};

interface DeleteOrganizationBrandingImageRequest {
    organizationId: string;
}

type DeleteOrganizationBrandingImageResponse = boolean

export const useDeleteOrganizationBrandingImage = (options?: MutationHookOptions<DeleteOrganizationBrandingImageResponse, DeleteOrganizationBrandingImageRequest>) => {
    return useMutation<DeleteOrganizationBrandingImageResponse, DeleteOrganizationBrandingImageRequest>(DELETE_ORGANIZATION_BRANDING_IMAGE, options);
};

interface DeleteOrganizationBrandingPrimaryColorRequest {
    organizationId: string;
}

type DeleteOrganizationBrandingPrimaryColorResponse = boolean

export const useDeleteOrganizationBrandingPrimaryColor = (options?: MutationHookOptions<DeleteOrganizationBrandingPrimaryColorResponse, DeleteOrganizationBrandingPrimaryColorRequest>) => {
    return useMutation<DeleteOrganizationBrandingPrimaryColorResponse, DeleteOrganizationBrandingPrimaryColorRequest>(DELETE_ORGANIZATION_BRANDING_PRIMARY_COLOR, options);
};
