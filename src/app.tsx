import { ApolloClient, ApolloLink } from "@apollo/client/core";
import { ApolloProvider } from "@apollo/client/react";
import { ThemeProvider } from "@material-ui/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createUploadLink } from "apollo-upload-client";
import React, { useEffect } from "react";
import { isEdge, isIE, isIOS, isMobile, isMobileSafari } from "react-device-detect";
import { useStore } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import Header from "./components/styled/navbar/header";
import NavBar from "./components/styled/navbar/navbar";
import { default as Admin } from "./pages/admin/kidsloop-orgadmin-fe/src/App";
import { cache } from "./pages/admin/kidsloop-orgadmin-fe/src/cache";
import ClassRosterTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/ClassRoster/ClassRosterTable";
import GradeTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/Grade/Grades";
import GroupTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/Group/GroupTable";
import AllOrganization from "./pages/admin/kidsloop-orgadmin-fe/src/components/Organization/AllOrganitation";
import Organization from "./pages/admin/kidsloop-orgadmin-fe/src/components/Organization/EditOrganization";
import EditOrganization from "./pages/admin/kidsloop-orgadmin-fe/src/components/Organization/EditOrganization";
import JoinedOrganizationTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/Organization/JoinedOrganizationTable";
import MyOrganizationTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/Organization/MyOrganizationTable";
import ClasessTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/School/ClassesTable";
import ProgramTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/School/ProgramTable";
import SchoolTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/School/SchoolTable";
import User from "./pages/admin/kidsloop-orgadmin-fe/src/components/User";
import { BrowserList } from "./pages/browserList";
import Home from "./pages/home/home";
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

const link = createUploadLink({
    uri: "https://api.kidsloop.net/user/",
});

export const client = new ApolloClient({
    link: ApolloLink.from([link]),
    cache,
});

export function App() {
    const store = useStore();

    if (window.location.host.split(":")[0] !== "localhost") {
        redirectIfUnauthorized();
    }

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
        <ApolloProvider client={client}>
            <NavBar menuLabels={mainNavBar} />
            <Switch>
                <Route path="/live" render={() => <Home />} />
                <Route path="/library" render={() => <>
                    <iframe src={"https://kl2-test.kidsloop.net/#/library"}
                        frameBorder="0"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </>} />
                <Route path="/badanamu-content" render={() => <>
                    <iframe src={"https://kl2-test.kidsloop.net/#/library/my-content-list?program=program1&content_type=1%2C2&order_by=-update_at&page=1&scope=all"}
                        frameBorder="0"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </>} />
                <Route path="/schedule" render={() => <>
                    <iframe src={"https://kl2-test.kidsloop.net/#/schedule/calendar"}
                        frameBorder="0"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </>} />
                <Route path="/assessments" render={() => <>
                    <iframe src={"https://kl2-test.kidsloop.net/#/assessments/assessment-list"}
                        frameBorder="0"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </>} />
                <Route path="/report" render={() => <>
                    <iframe src={"https://kl2-test.kidsloop.net/#/report/achievement-list"}
                        frameBorder="0"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </>} />
                <Route path="/admin/edit-organization/:organizationId">
                    <Header/>
                    <EditOrganization />
                </Route>
                <Route path="/admin/create-organization" component={Organization} />
                {/* <Header/>
                    <Organization /> */}
                {/* </Route> */}
                <Route path="/admin/my-organization">
                    <Header/>
                    <MyOrganizationTable />
                </Route>
                <Route path="/admin/joined-organization">
                    <Header/>
                    <JoinedOrganizationTable />
                </Route>
                <Route path="/admin/allOrganization">
                    <Header/>
                    <AllOrganization />
                </Route>
                <Route path="/admin/user">
                    <Header/>
                    <User />
                </Route>
                <Route path="/admin/group">
                    <Header/>
                    <GroupTable />
                </Route>
                <Route path="/admin/school">
                    <Header/>
                    <SchoolTable />
                </Route>
                <Route path="/admin/classes">
                    <Header/>
                    <ClasessTable />
                </Route>
                <Route path="/admin/program">
                    <Header/>
                    <ProgramTable />
                </Route>
                <Route path="/admin/grade">
                    <Header/>
                    <GradeTable />
                </Route>
                <Route path="/admin/classRoster">
                    <Header/>
                    <ClassRosterTable />
                </Route>
                <Route path="/admin/classRoster/:classId">
                    <Header/>
                    <ClassRosterTable />
                </Route>
                <Route path="/admin">
                    <Header/>
                    <User />
                </Route>
                {/* <Route path="/admin">
                    <Admin />
                </Route> */}
                <Route render={() => <Home /> }/>
            </Switch>
        </ApolloProvider>
    );
}

export default App;
