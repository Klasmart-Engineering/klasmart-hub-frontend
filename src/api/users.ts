import { UserFilter } from "./organizationMemberships";
import { getAuthEndpoint } from "@/config";
import { UPLOAD_USERS_CSV } from "@/operations/mutations/uploadUsersCsv";
import { GET_MY_USERS } from "@/operations/queries/getMyUsers";
import { GET_USER } from "@/operations/queries/getUser";
import { ME } from "@/operations/queries/me";
import {
    SortOrder,
    Status,
    User,
} from "@/types/graphQL";
import { refreshToken } from "@/utils/redirectIfUnauthorized";
import {
    QueryHookOptions,
    useLazyQuery,
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

export async function switchUser (userId: string, retry = true): Promise<boolean> {
    try {
        const headers = new Headers();
        headers.append(`Accept`, `application/json`);
        headers.append(`Content-Type`, `application/json`);
        const response = await fetch(`${getAuthEndpoint()}switch`, {
            body: JSON.stringify({
                user_id: userId,
            }),
            credentials: `include`,
            headers,
            method: `POST`,
        });
        await response.text();
        window.location.reload(); // TODO: Dirty fix - remove and improve handling in the future
        return response.ok;
    } catch(e) {
        if(!retry) { return false; }
        await refreshToken();
        return switchUser(userId, false);
    }
}

interface UploadCsvResponse {
    filename?: string;
    minetype?: string;
    encoding?: string;
}

interface UploadUserCsvRequest {
    file: File;
    isDryRun: boolean;
}

interface GetMyUsersRequest {
    filter: UserFilter;
}

export interface UserNode {
    id: string;
    avatar: string | null;
    givenName: string | null;
    familyName: string | null;
    contactInfo: {
        email: string;
        phone: string;
    };
    status: Status;
    organizations: {
        userStatus: Status;
    }[];
    dateOfBirth: string;
}

export interface UserEdge {
    node: UserNode;
}

export interface GetMyUsersResponse {
    usersConnection: {
        edges: UserEdge[];
    };
}

export const useGetMyUsers = (options?: QueryHookOptions<GetMyUsersResponse, GetMyUsersRequest>) => {
    return useQuery<GetMyUsersResponse, GetMyUsersRequest>(GET_MY_USERS, options);
};

interface GetUserRequest {
    user_id: string;
}

interface GetUserResponse {
    user: User;
}

export const useGetUser = (options?: QueryHookOptions<GetUserResponse, GetUserRequest>) => {
    return useQuery<GetUserResponse, GetUserRequest>(GET_USER, options);
};

export const useUploadUserCsv = () => {
    return useMutation<UploadCsvResponse, UploadUserCsvRequest>(UPLOAD_USERS_CSV);
};

interface GetMeRequest {
    user_id: string;
}

interface GetMeResponse {
    me: {
        avatar: string | null;
        email: string;
        phone: string;
        user_id: string;
        username: string;
        given_name: string;
        family_name: string;
    };
}

export const useGetMe = (options?: QueryHookOptions<GetMeResponse, GetMeRequest>) => {
    return useQuery<GetMeResponse, GetMeRequest>(ME, options);
};
