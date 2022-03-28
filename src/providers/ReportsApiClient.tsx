import { authClient } from "@/api/auth/client";
import { getReportsEndpoint } from "@/config";
import { redirectToAuth } from "@/utils/routing";
import { ReportsApiClientProvider as KLReportsApiClientProvider } from "@kl-engineering/reports-api-client";
import { AxiosError } from "axios";
import React,
{
    useCallback,
    useEffect,
    useState,
} from "react";
import Cookies from "universal-cookie";

const AUTH_HEADER = `authorization`;
const ACCESS_TOKEN_COOKIE = `access`;

interface Props {
    children: React.ReactNode;
}

export default function ReportsApiClientProvider (props: Props) {
    const { children } = props;
    const reportsServiceEndpoint = getReportsEndpoint();
    const cookies = new Cookies();
    const [ accessToken, setAccessToken ] = useState(cookies.get(ACCESS_TOKEN_COOKIE));

    const STALE_TIME = 60 * 1000; // 60 seconds
    const REQUEST_RETRY_MAX_COUNT = 3; // 3
    const USE_MOCK_DATA = process.env.TEACHER_WIDGET_DASHBOARD_USE_MOCK_DATA === `true`;

    const retryHandler = useCallback(async (error: AxiosError) => {
        if (error.response?.status !== 401) throw error;
        try {
            await authClient.refreshToken();
            const updatedCookie = new Cookies();
            const updatedAccessToken = updatedCookie.get(ACCESS_TOKEN_COOKIE);
            error.config.headers![AUTH_HEADER] = updatedAccessToken;
            setAccessToken(updatedAccessToken);
        } catch (err) {
            redirectToAuth({
                withParams: true,
            });
            throw err;
        }
    }, [ setAccessToken ]);

    return (
        <KLReportsApiClientProvider
            config={{
                baseURL: reportsServiceEndpoint,
                headers: {
                    [AUTH_HEADER]: accessToken,
                },
            }}
            queryOptions={{
                defaultOptions: {
                    queries: {
                        staleTime: STALE_TIME,
                        retry: REQUEST_RETRY_MAX_COUNT,
                    },
                },
            }}
            requestInterceptors={USE_MOCK_DATA ? [
                {
                    onFulfilled: ((config) => {
                        const BASE_URL = `/reportsMockData`;
                        switch (config.params.repid) {
                        case `clsattendrategrp`:
                            return {
                                ...config,
                                baseURL: BASE_URL,
                                url: `/clsattendrategrp.json`,
                            };
                        case `pendingassignment`:
                            return {
                                ...config,
                                baseURL: BASE_URL,
                                url: `/pendingassignment.json`,
                            };
                        case `clsteacher`:
                            return {
                                ...config,
                                baseURL: BASE_URL,
                                url: `/clsteacher.json`,
                            };
                        case `contentteacher`:
                            return {
                                ...config,
                                baseURL: BASE_URL,
                                url: `/contentteacher.json`,
                            };
                        default:
                            return config;
                        }
                    }),
                },
            ] : undefined}
            responseInterceptors={USE_MOCK_DATA ? [
                {
                    onFulfilled: ((config) => {
                        const now = Date.now();
                        const thirtyMinutes = 1000 * 60 * 30;
                        const expiryTime = Date.now() + thirtyMinutes;

                        const baseResponseMock = {
                            lastupdate: Math.floor(now / 1000),
                            expiry: Math.floor(expiryTime / 1000),
                            successful: true,
                        };
                        return {
                            ...config,
                            data: {
                                ...config.data,
                                ...baseResponseMock,
                            },
                        };
                    }),
                },
                {
                    onRejected: retryHandler,
                },
            ] : undefined}
        >
            {children}
        </KLReportsApiClientProvider>
    );
}
