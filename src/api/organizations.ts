import { GET_MY_ORGANIZATION } from "@/operations/queries/getMyOrganization";
import { GET_ORGANIZATIONS } from "@/operations/queries/getOrganizations";
import { User } from "@/types/graphQL";
import { useQuery } from "@apollo/client";

interface GetOrganizationsRequest {
}

interface GetOrganizationsResponse {
    me: User
}

export const useGetOrganizations = () => {
    return useQuery<GetOrganizationsResponse, GetOrganizationsRequest>(GET_ORGANIZATIONS, {
        fetchPolicy: "network-only",
    });
};

interface GetMyOrganizationRequest {
    user_id: string
}

interface GetMyOrganizationResponse {
    user: User
}

export const useGetMyOrganization = (userId: string) => {
    return useQuery<GetMyOrganizationResponse, GetMyOrganizationRequest>(GET_MY_ORGANIZATION, {
        fetchPolicy: "network-only",
        variables: {
            user_id: userId,
        },
    });
};
