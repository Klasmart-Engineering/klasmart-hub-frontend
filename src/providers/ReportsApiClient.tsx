import { authClient } from "@/api/auth/client";
import { getReportsEndpoint } from "@/config";
import { ReportsApiClientProvider as KLReportsApiClientProvider } from "@kidsloop/reports-api-client";
import { AxiosError } from "axios";
import React,
{
    useCallback,
    useEffect,
    useState,
} from "react";
import { useCookies } from "react-cookie";

const AUTH_HEADER = `authorization`;
const ACCESS_TOKEN_COOKIE = `access`;

interface Props {
    children: React.ReactNode;
}

export default function ReportsApiClientProvider (props: Props) {
    const { children } = props;
    const reportsServiceEndpoint = getReportsEndpoint();
    const [ cookies ] = useCookies([ ACCESS_TOKEN_COOKIE ]);
    const [ currentDate, setCurrentDate ] = useState(Date.now());

    const STALE_TIME = 60 * 1000; // 60 seconds
    const REQUEST_RETRY_MAX_COUNT = 3; // 3

    useEffect(() => {
        let timeTilExpiry = STALE_TIME;
        const getTokenExpiry = async () => {
            const { exp } = await authClient.refreshToken();
            if (exp) timeTilExpiry = exp - (currentDate / 1000);
        };
        getTokenExpiry();
        const timeOut = setTimeout(() => setCurrentDate(Date.now()), timeTilExpiry);
        return () => clearTimeout(timeOut);
    }, [ currentDate ]);

    return (
        <KLReportsApiClientProvider
            config={{
                baseURL: reportsServiceEndpoint,
                headers: {
                    [AUTH_HEADER]: cookies.access,
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
        >
            {children}
        </KLReportsApiClientProvider>
    );
}
