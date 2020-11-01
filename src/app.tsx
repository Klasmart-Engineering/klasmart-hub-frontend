import React, { useEffect } from "react";
import { isEdge, isIE, isIOS, isMobile, isMobileSafari } from "react-device-detect";
import { useStore } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import { isLoggedIn } from "./components/authorized";
import NavBar from "./components/styled/navbar/navbar";
import { Layout } from "./layout";
import { Login } from "./pages/accounts/login";
import { Signup } from "./pages/accounts/signup";
import { SignupInvite } from "./pages/accounts/signup-invite";
import { Authorized } from "./pages/auth/authorized";
import { Invited } from "./pages/auth/invited";
import { BrowserList } from "./pages/browserList";
import Home from "./pages/home/home";
import LiveLayout from "./pages/home/live/live";
import ReportLayout from "./pages/home/report/report";
import { MyAccount } from "./pages/my-account";
import { PasswordChange } from "./pages/passwords/password-change";
import { PasswordChanged } from "./pages/passwords/password-changed";
import { PasswordForgot } from "./pages/passwords/password-forgot";
import { PasswordRestore } from "./pages/passwords/password-restore";
import { VerifyAccount } from "./pages/verify/verify-account";
import { VerifyInvite } from "./pages/verify/verify-invite";
import { VerifyLink } from "./pages/verify/verify-link";
import { ActionTypes } from "./store/actions";
import { IdentityType } from "./utils/accountType";
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
    const authorized = redirectIfUnauthorized();

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
            {/* <Route path="/login" component={Login} />
            <Route path="/password-change" component={PasswordChange} />
            <Route path="/password-changed" component={PasswordChanged} />
            <Route path="/password-forgot" component={PasswordForgot} />
            <Route path="/password-restore" component={PasswordRestore} /> */}

            {/* <Route path="/signup" component={Signup} /> */}
            {/* <Route path="/signup-invite" component={SignupInvite} /> */}
            {/* <Route path="/invited" component={Invited} /> */}
            {/* <Route path="/authorized" component={Authorized} /> */}
            {/* <Route path="/verify-invite" component={VerifyInvite} /> */}
            {/* <Route path="/verify-phone" render={(props) => <VerifyAccount type={IdentityType.Phone} {...props} />} /> */}
            {/* <Route path="/verify-email" render={(props) => <VerifyAccount type={IdentityType.Email} {...props} />} /> */}
            {/* <Route path="/verify_email" component={VerifyLink} /> */}
            {/* <Route path="/my-account" component={MyAccount} /> */}
            <Route path="/live" render={() => !authorized ? null : <Home />} />
            <Route path="/library" render={() => !authorized ? null : <>
                <NavBar menuLabels={mainNavBar} />
                <iframe src={"https://kl2-test.kidsloop.net/#/library"}
                    frameBorder="0"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </>} />
            <Route path="/badanamu-content" render={() => !authorized ? null : <>
                <NavBar menuLabels={mainNavBar} />
                <iframe src={"https://kl2-test.kidsloop.net/#/library/my-content-list?program=program1&content_type=1%2C2&order_by=-update_at&page=1&scope=all"}
                    frameBorder="0"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </>} />
            <Route path="/schedule" render={() => !authorized ? null : <>
                <NavBar menuLabels={mainNavBar} />
                <iframe src={"https://kl2-test.kidsloop.net/#/schedule/calendar"}
                    frameBorder="0"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </>} />
            <Route path="/assessments" render={() => !authorized ? null : <>
                <NavBar menuLabels={mainNavBar} />
                <iframe src={"https://kl2-test.kidsloop.net/#/assessments/assessment-list"}
                    frameBorder="0"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </>} />
            <Route path="/report" render={() => !authorized ? null : <ReportLayout />} />
            <Route render={() => <Home /> }/>
        </Switch>
    );
}

export default App;
