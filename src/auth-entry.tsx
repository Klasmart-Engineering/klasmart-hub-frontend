import { getAuthEndpoint } from "./config";
import SiteLoading from "@/components/Utility/SiteLoading";
import { refreshToken } from "@/utils/redirectIfUnauthorized";
import queryString from "querystring";
import React,
{
    Suspense,
    useEffect,
    useState,
} from "react";

export default function Entry () {
    const [ isAwaitingAuthtoken, setIsAwaitingAuthtoken ] = useState(true);
    const [ isAuthenticated, setIsAuthenticated ] = useState(false);
    const [ EntryComponent, setEntryComponent ] = useState(<SiteLoading />);

    const stringifiedQuery = queryString.stringify({
        continue: window.location.href,
    });

    const initAuth = async () => {
        const hasAuthToken = await refreshToken();
        setIsAuthenticated(!!hasAuthToken);
        setIsAwaitingAuthtoken(false);
    };

    useEffect(() => {
        initAuth();
    }, []);

    useEffect(() => {
        if (isAwaitingAuthtoken) return;
        if (!isAuthenticated) {
            window.location.href = `${getAuthEndpoint()}?${stringifiedQuery}#/`;
            return;
        }
        const Providers = React.lazy(() => import(`@/providers`));
        setEntryComponent(<Providers />);
    }, [ isAwaitingAuthtoken, isAuthenticated ]);

    return (
        <Suspense fallback={<SiteLoading />}>
            {EntryComponent}
        </Suspense>
    );
}
