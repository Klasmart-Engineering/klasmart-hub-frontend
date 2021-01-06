import { GET_ALL_GROUPS } from "@/operations/queries/getAllGroups";
import { Organization } from "@/types/graphQL";
import { useQuery } from "@apollo/client";

interface GetAllRolesRequest {
    organization_id: string
}

interface GetAllRolesResponse {
    organization: Organization
}

export const useGetAllRoles = (organizationId: string) => {
    return useQuery<GetAllRolesResponse, GetAllRolesRequest>(GET_ALL_GROUPS, {
        fetchPolicy: "network-only",
        variables: {
            organization_id: organizationId,
        },
    });
};
