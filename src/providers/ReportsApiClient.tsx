import { authClient } from "@/api/auth/client";
import { WidgetView } from "@/components/Dashboard/WidgetManagement/defaultWidgets";
import { getReportsEndpoint } from "@/config";
import { REQUEST_RETRY_COUNT_MAX } from "@/config/index";
import { useDashboardMode } from "@/state/useDashboardMode";
import { redirectToAuth } from "@/utils/routing";
import { ReportsApiClientProvider as KLReportsApiClientProvider } from "@kl-engineering/reports-api-client";
import { AxiosError } from "axios";
import React,
{ useMemo } from "react";
import Cookies from "universal-cookie";

const AUTH_HEADER = `authorization`;
const ACCESS_TOKEN_COOKIE = `access`;

interface Props {
    children: React.ReactNode;
}

export default function ReportsApiClientProvider (props: Props) {
    const { children } = props;
    const reportsServiceEndpoint = getReportsEndpoint();
    const { view } = useDashboardMode();

    const STALE_TIME = 60 * 1000; // 60 seconds

    const useMockData = useMemo(() => {
        return (view === WidgetView.STUDENT ?
            process.env.STUDENT_WIDGET_DASHBOARD_USE_MOCK_DATA
            : process.env.TEACHER_WIDGET_DASHBOARD_USE_MOCK_DATA) === `true`;
    }, [ view ]);

    const retryHandler = async (error: AxiosError) => {
        if (error.response?.status !== 401) throw error;
        try {
            await authClient.refreshToken();
            const updatedCookie = new Cookies();
            const updatedAccessToken = updatedCookie.get(ACCESS_TOKEN_COOKIE);
            error.config.headers![AUTH_HEADER] = updatedAccessToken;
        } catch (err) {
            redirectToAuth({
                withParams: true,
            });
            throw err;
        }
    };

    return (
        <KLReportsApiClientProvider
            config={{
                baseURL: reportsServiceEndpoint,
            }}
            queryOptions={{
                defaultOptions: {
                    queries: {
                        staleTime: STALE_TIME,
                        retry: REQUEST_RETRY_COUNT_MAX,
                    },
                },
            }}
            requestInterceptors={useMockData ? [
                {
                    onFulfilled: (config) => {
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
                        case `student_learningoutcome`:
                            return {
                                ...config,
                                baseURL: BASE_URL,
                                url: `/studentlearningoutcome.json`,
                            };
                        case `student_attendrate`:
                            return {
                                ...config,
                                baseURL: BASE_URL,
                                url: `/studentattendrate.json`,
                            };
                        case `student_assesscomp`:
                            return{
                                ...config,
                                baseURL: BASE_URL,
                                url: `/studentassesmentcompletion.json`,
                            };
                        default:
                            return config;
                        }
                    },
                },
            ] : [
                {
                    onFulfilled: (config) => {
                        const updatedCookie = new Cookies();
                        const updatedAccessToken = updatedCookie.get(ACCESS_TOKEN_COOKIE);
                        const updatedConfig = {
                            ...config,
                            headers: {
                                ...config.headers,
                                [AUTH_HEADER]: updatedAccessToken,
                            },
                        };
                        return updatedConfig;
                    },
                },
            ]}
            responseInterceptors={useMockData ? [
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
            ] : [
                {
                    onRejected: retryHandler,
                },
            ]}
        >
            {children}
        </KLReportsApiClientProvider>
    );
}
