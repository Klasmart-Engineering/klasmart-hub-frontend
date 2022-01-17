import { getCmsApiEndpoint } from "@/config";
import { CmsApiClientProvider as KLCmsApiClientProvider } from "@kidsloop/cms-api-client";
import React from "react";

interface Props {
    children: React.ReactNode;
}

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
                    },
                },
            }}
        >
            {children}
        </KLCmsApiClientProvider>
    );
}
