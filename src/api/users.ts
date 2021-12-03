import { OrganizationMembershipsConnection } from "./organizationMemberships";
import { RoleSummaryNode } from "./roles";
import { SchoolSummaryNode } from "./schools";
import { UPLOAD_USERS_CSV } from "@/operations/mutations/uploadUsersCsv";
import { GET_MY_USERS } from "@/operations/queries/getMyUsers";
import { GET_USER_NODE } from "@/operations/queries/getUserNode";
import { GET_USER_NODE_SCHOOL_MEMBERSHIPS } from "@/operations/queries/getUserNodeSchoolMemberships";
import { ME } from "@/operations/queries/me";
import { MY_USER } from "@/operations/queries/myUser";
import { User } from "@/types/graphQL";
import {
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

export const myUsersSampleResponse = {
    data: {
        my_users: [
            {
                user_id: `d6725ee8-234b-5462-a725-479000f5ed66`,
                given_name: `Shawn`,
                family_name: `Lee`,
                username: ``,
                email: `shawn.lee@calmid.com`,
                phone: ``,
                date_of_birth: `12-1994`,
            },
            {
                user_id: `a2e44561-677f-5215-b75f-41cb4277c1db`,
                given_name: null,
                family_name: null,
                username: `Shawn`,
                email: `shawn.lee@calmid.com`,
                phone: null,
                date_of_birth: null,
            },
        ],
    },
};

interface UploadCsvResponse {
    filename?: string;
    minetype?: string;
    encoding?: string;
}

interface UploadUserCsvRequest {
    file: File;
    isDryRun: boolean;
}

interface GetMyUsersRequest {}

interface GetMyUsersResponse {
    my_users: User[];
}

export const useGetMyUsers = (options?: QueryHookOptions<GetMyUsersResponse, GetMyUsersRequest>) => {
    return useQuery<GetMyUsersResponse, GetMyUsersRequest>(GET_MY_USERS, options);
};

export interface GetUserNodeRequest {
    id: string;
    organizationId?: string;
}

export interface GetUserNodeResponse {
    userNode: UserNode;
}

export const useGetUserNode = (options?: QueryHookOptions<GetUserNodeResponse, GetUserNodeRequest>) => {
    return useQuery<GetUserNodeResponse, GetUserNodeRequest>(GET_USER_NODE, options);
};

export const useGetUserNodeSchoolMemberships = (options?: QueryHookOptions<GetUserNodeResponse, GetUserNodeRequest>) => {
    return useQuery<GetUserNodeResponse, GetUserNodeRequest>(GET_USER_NODE_SCHOOL_MEMBERSHIPS, options);
};

export const useUploadUserCsv = () => {
    return useMutation<UploadCsvResponse, UploadUserCsvRequest>(UPLOAD_USERS_CSV);
};

export interface UserNode {
    id: string;
    givenName: string | null;
    familyName: string | null;
    contactInfo?: {
        email: string | null;
        phone: string | null;
    };
    alternateContactInfo?: {
        email: string | null;
        phone: string | null;
    };
    organizations?: {
        userStatus: string;
        userShortCode: string;
        joinDate: string;
    }[];
    roles?: RoleSummaryNode[];
    schools?: SchoolSummaryNode[];
    dateOfBirth?: string;
    gender?: string;
    avatar?: string;
    organizationMembershipsConnection?: OrganizationMembershipsConnection;
}

interface GetMeRequest {
    user_id: string;
}

interface GetMyUserRequest {}

interface GetMeResponse {
    me?: {
        avatar: string | null;
        email: string;
        phone: string;
        user_id: string;
        username: string;
        given_name: string;
        family_name: string;
    };
}

interface GetMyUserResponse {
    myUser: {
        node: UserNode;
    };
}

export const useGetMe = (options?: QueryHookOptions<GetMeResponse, GetMeRequest>) => {
    return useQuery<GetMeResponse, GetMeRequest>(ME, options);
};

export const useGetMyUser = (options?: QueryHookOptions<GetMyUserResponse, GetMyUserRequest>) => {
    return useQuery<GetMyUserResponse, GetMyUserRequest>(MY_USER, options);
};
