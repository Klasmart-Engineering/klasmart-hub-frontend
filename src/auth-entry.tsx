import { authClient } from "@/api/auth/client";
import SiteLoading from "@/components/Utility/SiteLoading";
import HealthPage from "@/pages/health";
import VersionPage from "@/pages/version";
import { redirectToAuth } from "@/utils/routing";
import React,
{
    Suspense,
    useEffect,
    useState,
} from "react";
import {
    HashRouter,
    Route,
    Routes,
} from "react-router-dom";

export default function AuthEntry () {
    return (
        <HashRouter>
            <Routes>
                <Route
                    path="/version"
                    element={<VersionPage />}
                />
                <Route
                    path="/health"
                    element={<HealthPage />}
                />
                <Route
                    path="/*"
                    element={<ProtectedEntry />}
                />
            </Routes>
        </HashRouter>
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
