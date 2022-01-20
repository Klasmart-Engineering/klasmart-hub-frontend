import { getAuthEndpoint } from "@/config";
import { REQUEST_RETRY_COUNT_MAX } from "@/config/index";
import axios,
{ AxiosError } from "axios";

const authInstance = axios.create({
    withCredentials: true,
    baseURL: getAuthEndpoint(),
});

export interface RefreshData {
    email: string;
    exp: number;
    id: string;
    iss: string;
}

const refreshToken = async () => {
    const resp = await authInstance.get<RefreshData>(`/refresh`);
    return resp.data;
};

export interface SignOutData {
}

const signOut = async () => {
    const resp = await authInstance.get<SignOutData>(`/signout`);
    return resp.data;
};

export interface SwitchUserBody {
    user_id: string;
}

export interface SwitchUserData {
}

const switchUser = async (body: SwitchUserBody) => {
    const resp = await authInstance.post<SwitchUserData>(`/switch`, body);
    return resp.data;
};

class AuthClient {
    static baseURL = authInstance.defaults.baseURL;

    refreshToken = refreshToken;
    signOut = signOut;
    switchUser = switchUser;
}

const authClient = new AuthClient();

const retryHandler = async (error: AxiosError) => {
    if (((error.config as any).retryCount ?? 0) > REQUEST_RETRY_COUNT_MAX) throw error;
    if (error.config.url === `/refresh`) throw error;
    (error.config as any).retryCount = 1;
    if (error.response?.status !== 401) throw error;
    try {
        await authClient.refreshToken();
        return error.config.adapter?.(error.config);
    } catch (err) {
        await authClient.signOut();
        throw err;
    }
};

authInstance.interceptors.response.use(undefined, retryHandler);

export {
    AuthClient,
    authClient,
};
