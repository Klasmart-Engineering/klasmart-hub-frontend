import { useQuery, useReactiveVar } from "@apollo/client/react";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import { isEdge, isIE, isIOS, isMobile, isMobileSafari } from "react-device-detect";
import { useStore } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import Header from "./components/styled/navbar/adminHeader";
import NavBar from "./components/styled/navbar/navbar";
import { getCNEndpoint } from "./config";
import { currentMembershipVar, userIdVar } from "./pages/admin/kidsloop-orgadmin-fe/src/cache";
import ClassRosterTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/ClassRoster/ClassRosterTable";
import GradeTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/Grade/GradesTable";
import Layout from "./pages/admin/kidsloop-orgadmin-fe/src/components/Layout";
import AllOrganization from "./pages/admin/kidsloop-orgadmin-fe/src/components/Organization/AllOrganitation";
import EditOrganization from "./pages/admin/kidsloop-orgadmin-fe/src/components/Organization/EditOrganization";
import JoinedOrganizationTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/Organization/JoinedOrganizationTable";
import MyOrganizationTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/Organization/MyOrganizationTable";
import Organization from "./pages/admin/kidsloop-orgadmin-fe/src/components/Organization/Organization";
import RolTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/Rol/RolTable";
import ClasessTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/School/ClassesTable";
import ProgramTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/School/ProgramsTable";
import SchoolTable from "./pages/admin/kidsloop-orgadmin-fe/src/components/School/SchoolTable";
import User from "./pages/admin/kidsloop-orgadmin-fe/src/components/User";
import { GET_USER } from "./pages/admin/kidsloop-orgadmin-fe/src/operations/queries/getUser";
import { redirectIfUnauthorized, refreshToken } from "./pages/admin/kidsloop-orgadmin-fe/src/util/redirectIfUnauthorized";
import { BrowserList } from "./pages/browserList";
import Home from "./pages/home/home";
import { ActionTypes } from "./store/actions";
// import { redirectIfUnauthorized } from "./utils/accountUtils";

const TIMEOUT = 360000; // 1 minute
const ENDPOINT = getCNEndpoint();

export const mainNavBar = [{
    name: "home",
    path: "/",
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
    const location = useLocation().pathname;

    const [organizationData, setOrganizationData] = useState([]);
    const [expiration, setExpiration] = useState(TIMEOUT);
    const [key, setKey] = useState(Math.random().toString(36));
    const currentOrganization = useReactiveVar(currentMembershipVar);

    useEffect(() => { redirectIfUnauthorized(); }, [location]);

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

    const user_id = useReactiveVar(userIdVar);
    const { data: userData, loading: userDataLoading, error } = useQuery(GET_USER, {
        fetchPolicy: "network-only",
        variables: {
            user_id,
        },
    });

    useEffect(() => {
        if (userData) {
            let joinedOrgArray = [];
            const arr: any = [];
            const joined_organization = _get(userData, "user.memberships", false);
            if (joined_organization) {
                arr.push(joined_organization);
                joinedOrgArray = arr.map((o: any) => ({ ...o }));
                setOrganizationData(joinedOrgArray[0]);
            }
        }
    }, [userData]);

    useEffect(() => {
        if (_isEmpty(organizationData)) { return; }
        if (organizationData[0].organization !== undefined) {
            currentMembershipVar({
                organization_name: organizationData[0].organization.organization_name,
                organization_id: organizationData[0].organization.organization_id,
                organization_email: organizationData[0].organization.email,
            });
        }
    }, [organizationData, user_id]);

    return ((isIE <= 11 && isIE !== false) ? <BrowserList /> :
        <>
            <NavBar menuLabels={mainNavBar} />
            <Switch>
                <Route path="/" render={() => <Home />} />
                <Route path="/library" render={() => <>
                    <iframe src={`${ENDPOINT}?org_id=${currentOrganization.organization_id}#/library`}
                        frameBorder="0"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </>} />
                <Route path="/badanamu-content" render={() => <>
                    <iframe src={`${ENDPOINT}?org_id=${currentOrganization.organization_id}#/library/my-content-list?program=program1&content_type=1%2C2&order_by=-update_at&page=1&scope=all`}
                        frameBorder="0"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </>} />
                <Route path="/schedule" render={() => <>
                    <iframe src={`${ENDPOINT}?org_id=${currentOrganization.organization_id}#/schedule/calendar`}
                        frameBorder="0"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </>} />
                <Route path="/assessments" render={() => <>
                    <iframe src={`${ENDPOINT}?org_id=${currentOrganization.organization_id}#/assessments/assessment-list`}
                        frameBorder="0"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </>} />
                <Route path="/report" render={() => <>
                    <iframe src={`${ENDPOINT}?org_id=${currentOrganization.organization_id}#/report/achievement-list`}
                        frameBorder="0"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </>} />
                <Route exact path="/admin/edit-organization/:organizationId">
                    <Layout>
                        <EditOrganization />
                    </Layout>
                </Route>
                <Route path="/admin/create-organization">
                    <Layout>
                        <Organization />
                    </Layout>
                </Route>
                <Route path="/admin/my-organization">
                    <Layout>
                        <MyOrganizationTable />
                    </Layout>
                </Route>
                <Route path="/admin/joined-organization">
                    <Layout>
                        <JoinedOrganizationTable />
                    </Layout>
                </Route>
                <Route path="/admin/allOrganization">
                    <Layout>
                        <AllOrganization />
                    </Layout>
                </Route>
                <Route path="/admin/user">
                    <Layout>
                        <User />
                    </Layout>
                </Route>
                <Route path="/admin/roles">
                    <Layout>
                        <RolTable />
                    </Layout>
                </Route>
                <Route path="/admin/school">
                    <Layout>
                        <SchoolTable />
                    </Layout>
                </Route>
                <Route path="/admin/classes">
                    <Layout>
                        <ClasessTable />
                    </Layout>
                </Route>
                <Route path="/admin/program">
                    <Layout>
                        <ProgramTable />
                    </Layout>
                </Route>
                <Route path="/admin/grade">
                    <Layout>
                        <GradeTable />
                    </Layout>
                </Route>
                <Route path="/admin/classRoster/:classId">
                    <Layout>
                        <ClassRosterTable />
                    </Layout>
                </Route>
                <Route path="/admin">
                    <Layout>
                        <User />
                    </Layout>
                </Route>
                <Route render={() => <Home />} />
            </Switch>
        </>
    );
}

export default App;
