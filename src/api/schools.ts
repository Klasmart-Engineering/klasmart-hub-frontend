import { GET_SCHOOLS } from "@/operations/queries/getSchools";
import { User } from "@/types/graphQL";
import { useQuery } from "@apollo/client";

interface GetSchoolsRequest {
    organizationId: string
}

interface GetSchoolsResponse {
    me: User
}

export const useGetSchools = (organizationId: string) => {
    return useQuery<GetSchoolsResponse, GetSchoolsRequest>(GET_SCHOOLS, {
        fetchPolicy: "network-only",
        variables: {
            organizationId
        },
    });
};
