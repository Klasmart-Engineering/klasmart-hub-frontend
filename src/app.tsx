import React, { useEffect } from "react";
import { isEdge, isIE, isIOS, isMobile, isMobileSafari } from "react-device-detect";
import { useStore } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import NavBar from "./components/styled/navbar/navbar";
import { Layout } from "./layout";
import { BrowserList } from "./pages/browserList";
import Home from "./pages/home/home";
import LiveLayout from "./pages/home/live/live";
import ReportLayout from "./pages/home/report/report";
import { ActionTypes } from "./store/actions";
import { redirectIfUnauthorized } from "./utils/accountUtils";

export const mainNavBar = [{
    name: "live",
    path: "/live",
}, {
    name: "library",
    path: "/library/my-content-list",
}, {
    name: "schedule",
    path: "/schedule/calendar",
}, {
    name: "assessments",
    path: "/assessments/assessment-list",
}, {
    name: "report",
    path: "/report",
}];

export function App() {
    const store = useStore();
    const location = useLocation();

    useEffect(() => {
        // console.log("authorized: ", authorized);
        // console.log(location)
    }, [location]);

    useEffect(() => {
        const userInformation = {
            isEdge,
            isIE,
            isIOS,
            isMobile,
            isMobileSafari,
        };

        store.dispatch({ type: ActionTypes.USER_AGENT, payload: userInformation });
    }, []);

    return ((isIE <= 11 && isIE !== false) ? <BrowserList /> :
        <Switch>
            <Route path="/live" render={() => <Home />} />
            <Route path="/library" render={() => <>
                <NavBar menuLabels={mainNavBar} />
                <iframe src={"https://kl2-test.kidsloop.net/#/library"}
                    frameBorder="0"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </>} />
            <Route path="/badanamu-content" render={() => <>
                <NavBar menuLabels={mainNavBar} />
                <iframe src={"https://kl2-test.kidsloop.net/#/library/my-content-list?program=program1&content_type=1%2C2&order_by=-update_at&page=1&scope=all"}
                    frameBorder="0"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </>} />
            <Route path="/schedule" render={() => <>
                <NavBar menuLabels={mainNavBar} />
                <iframe src={"https://kl2-test.kidsloop.net/#/schedule/calendar"}
                    frameBorder="0"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </>} />
            <Route path="/assessments" render={() => <>
                <NavBar menuLabels={mainNavBar} />
                <iframe src={"https://kl2-test.kidsloop.net/#/assessments/assessment-list"}
                    frameBorder="0"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </>} />
            <Route path="/report" render={() => <ReportLayout />} />
            <Route render={() => <Home /> }/>
        </Switch>
    );
}

export default App;
