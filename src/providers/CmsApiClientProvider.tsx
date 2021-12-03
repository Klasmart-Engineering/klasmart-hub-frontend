import { authClient } from "@/api/auth/client";
import { getCmsApiEndpoint } from "@/config";
import { REQUEST_RETRY_COUNT_MAX } from "@/config/variables";
import { CmsApiClientProvider as KLCmsApiClientProvider } from "@kidsloop/cms-api-client";
import { AxiosError } from "axios";
import React from "react";

interface Props {
    children: React.ReactNode;
}

const retryHandler = async (error: AxiosError) => {
    if (error.response?.status !== 401 || error.response?.data.label !== `general_error_unauthorized`) throw error;
    try {
        await authClient.refreshToken();
    } catch (err) {
        await authClient.signOut();
        throw err;
    }
};

export default function CmsApiClientProvider (props: Props) {
    const { children } = props;
    const cmsServiceEndpoint = getCmsApiEndpoint();

    const STALE_TIME = 60 * 1000; // 60 seconds

    return (
        <KLCmsApiClientProvider
            config={{
                baseURL: cmsServiceEndpoint,
                withCredentials: true,
            }}
            queryOptions={{
                defaultOptions: {
                    queries: {
                        staleTime: STALE_TIME,
                        retry: REQUEST_RETRY_COUNT_MAX,
                    },
                },
            }}
            interceptors={[
                {
                    onRejected: retryHandler,
                },
            ]}
        >
            {children}
        </KLCmsApiClientProvider>
    );
}
