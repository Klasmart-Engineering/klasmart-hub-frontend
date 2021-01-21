import { GET_USER } from "@/operations/queries/getUser";
import { User } from "@/types/graphQL";
import {
    QueryHookOptions,
    useQuery,
} from "@apollo/client";

interface GetUserRequest {
    user_id: string;
}

interface GetUserResponse {
    user: User;
}

export const useGetUser = (options?: QueryHookOptions<GetUserResponse, GetUserRequest>) => {
    return useQuery<GetUserResponse, GetUserRequest>(GET_USER, options);
};
