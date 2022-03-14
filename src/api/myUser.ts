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
    node: (UserNode & {
      organizationMembershipsConnection: {
        edges: {
          node: {
            organization: {
              id: string;
              name: string;
              branding: {
                primaryColor: string | null;
                iconImageURL: string | null;
              };
              owners: {
                email: string;
              };
              contactInfo: {
                phone: string;
              };
            };
            rolesConnection: {
              edges: {
                node: RoleConnectionNode;
              }[];
            };
          };
        }[];
      };
    });
  };
}

export const useQueryMyUser = (options?: QueryHookOptions<MyUserResponse, MyUserRequest>) => {
    return useQuery<MyUserResponse, MyUserRequest>(MY_USER_QUERY, options);
};
