import { authClient } from "@/api/auth/client";
import { getReportsEndpoint } from "@/config";
import { ReportsApiClientProvider as KLReportsApiClientProvider } from "@kidsloop/reports-api-client";
import React,
{
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
    const [ currentDate, setCurrentDate ] = useState(Date.now());

    const STALE_TIME = 60 * 1000; // 60 seconds
    const REQUEST_RETRY_MAX_COUNT = 3; // 3
    const USE_MOCK_DATA = process.env.USE_MOCK_REPORTS_DATA === `true`;

    useEffect(() => {
        let timeTilExpiry = STALE_TIME;
        const getTokenExpiry = async () => {
            const updatedCookie = new Cookies();
            setAccessToken(updatedCookie.get(ACCESS_TOKEN_COOKIE));
            const { exp } = await authClient.refreshToken();
            if (exp) timeTilExpiry = (exp - (Math.floor(currentDate / 1000))) * 1000;
            const setDate = () => {
                setCurrentDate(Date.now());
            };
            const timeOut = setTimeout(setDate, timeTilExpiry + 1000);
            return () => clearTimeout(timeOut);
        };
        getTokenExpiry();
    }, [ currentDate ]);

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
            mock={USE_MOCK_DATA}
        >
            {children}
        </KLReportsApiClientProvider>
    );
}
