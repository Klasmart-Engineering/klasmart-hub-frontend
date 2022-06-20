import { RoleConnectionNode } from "./organizationMemberships";
import { UserNode } from "./users";
import { MY_USER_QUERY } from "@/operations/queries/myUser";
import {
    QueryHookOptions,
    useQuery,
} from "@apollo/client";

export interface MyUserRequest {
}

export interface MyUserResponse {
  myUser: {
    profiles: UserNode[];
    node: UserNode;
  };
}

export const useQueryMyUser = (options?: QueryHookOptions<MyUserResponse, MyUserRequest>) => {
    return useQuery<MyUserResponse, MyUserRequest>(MY_USER_QUERY, options);
};
