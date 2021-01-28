import { CREATE_NEW_ROLE } from "@/operations/mutations/createNewRole";
import { GET_ALL_GROUPS } from "@/operations/queries/getAllGroups";
import { GET_ORGANIZATION_ROLES_PERMISSIONS } from "@/operations/queries/getOrganizationRolesPermissions";
import { Organization } from "@/types/graphQL";
import {
    MutationHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface GetAllRolesRequest {
    organization_id: string;
}

interface GetAllRolesResponse {
    organization: Organization;
}

export const useGetAllRoles = (organizationId: string) => {
    return useQuery<GetAllRolesResponse, GetAllRolesRequest>(GET_ALL_GROUPS, {
        fetchPolicy: `network-only`,
        variables: {
            organization_id: organizationId,
        },
    });
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

export const useCreateRole = (
    options?: MutationHookOptions<CreateRoleResponse, CreateRoleRequest>,
) => {
    return useMutation<CreateRoleResponse, CreateRoleRequest>(
        CREATE_NEW_ROLE,
        options,
    );
};
