import { getReportsEndpoint } from "@/config";
import { ReportsApiClientProvider as KLReportsApiClientProvider } from "@kidsloop/reports-api-client";
import React from "react";
import { useCookies } from "react-cookie";

interface Props {
    children: React.ReactNode;
}

export default function ReportsApiClientProvider (props: Props) {
    const { children } = props;
    const reportsServiceEndpoint = getReportsEndpoint();
    const [ access ] = useCookies([ `access` ]);

    const STALE_TIME = 60 * 1000; // 60 seconds

    return (
        <KLReportsApiClientProvider
            config={{
                baseURL: reportsServiceEndpoint,
                headers: {
                    authorization: access.access,
                },
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
        </KLReportsApiClientProvider>
    );
}
