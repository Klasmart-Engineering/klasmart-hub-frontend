import SiteLoading from "@/components/Utility/SiteLoading";
import { getAuthEndpoint } from "@/config";
import HealthPage from "@/pages/health";
import VersionPage from "@/pages/version";
import { history } from "@/utils/history";
import { refreshToken } from "@/utils/redirectIfUnauthorized";
import queryString from "querystring";
import React,
{
    Suspense,
    useEffect,
    useState,
} from "react";
import {
    Route,
    Router,
    Switch,
} from "react-router-dom";

export default function AuthEntry () {
    return (
        <Router history={history}>
            <Switch>
                <Route
                    exact
                    path="/version"
                >
                    <VersionPage />
                </Route>
                <Route
                    exact
                    path="/health"
                >
                    <HealthPage />
                </Route>
                <Route>
                    <ProtectedEntry />
                </Route>
            </Switch>
        </Router>
    );
}

function ProtectedEntry () {
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
