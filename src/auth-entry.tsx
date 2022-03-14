import { authClient } from "@/api/auth/client";
import SiteLoading from "@/components/Utility/SiteLoading";
import HealthPage from "@/pages/health";
import VersionPage from "@/pages/version";
import { history } from "@/utils/history";
import { redirectToAuth } from "@/utils/routing";
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
    const [ isAwaitingAuthToken, setIsAwaitingAuthToken ] = useState(true);
    const [ isAuthenticated, setIsAuthenticated ] = useState(false);
    const [ EntryComponent, setEntryComponent ] = useState(<SiteLoading />);

    const initAuth = async () => {
        try {
            const authToken = await authClient.refreshToken();
            setIsAuthenticated(!!authToken.id);
        } catch (err) {
            setIsAuthenticated(false);
        }
        setIsAwaitingAuthToken(false);
    };

    useEffect(() => {
        initAuth();
    }, []);

    useEffect(() => {
        if (isAwaitingAuthToken) return;
        if (!isAuthenticated) {
            redirectToAuth({
                withParams: true,
            });
            return;
        }
        const Providers = React.lazy(() => import(`@/providers`));
        setEntryComponent(<Providers />);
    }, [ isAwaitingAuthToken, isAuthenticated ]);

    return (
        <Suspense fallback={<SiteLoading />}>
            {EntryComponent}
        </Suspense>
    );
}
