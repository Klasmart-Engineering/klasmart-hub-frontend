import {
    currentMembershipVar,
    userIdVar,
} from "./cache";
import NavBar from "./components/styled/navbar/navbar";
import { getCNEndpoint } from "./config";
import { GET_USER } from "./operations/queries/getUser";
import ClassRosterTable from "./pages/admin/ClassRoster/ClassRosterTable";
import Grades from "./pages/admin/grades";
import Layout from "./pages/admin/Layout";
import AllOrganization from "./pages/admin/Organization/AllOrganitation";
import EditOrganization from "./pages/admin/Organization/EditOrganization";
import Organization from "./pages/admin/Organization/Organization";
import ProgramsPage from "./pages/admin/programs";
import RoleTable from "./pages/admin/Role/RoleTable";
import ClassesPage from "./pages/admin/classes";
import SchoolTable from "./pages/admin/School/SchoolTable";
import SubjectsPage from "./pages/admin/subjects";
import User from "./pages/admin/User";
import { BrowserList } from "./pages/browserList";
import Home from "./pages/home/home";
import SuperAdminContentLibraryTable from "./pages/superAdmin/LibraryContent/Table";
import { ActionTypes } from "./store/actions";
import { redirectIfUnauthorized } from "./utils/redirectIfUnauthorized";
import AgeRanges from "@/pages/admin/age-ranges/index";
import {
    useQuery,
    useReactiveVar,
} from "@apollo/client/react";
import Grid from "@material-ui/core/Grid";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import React, {
    useEffect,
    useState,
} from "react";
import {
    isEdge,
    isIE,
    isIOS,
    isMobile,
    isMobileSafari,
} from "react-device-detect";
import { useStore } from "react-redux";
import {
    Route,
    Switch,
    useLocation,
} from "react-router-dom";

const ENDPOINT = getCNEndpoint();

export function App () {
    const store = useStore();
    const location = useLocation().pathname;

    const [ organizationData, setOrganizationData ] = useState([]);
    const currentOrganization = useReactiveVar(currentMembershipVar);

    useEffect(() => { redirectIfUnauthorized(); }, [ location ]);

    useEffect(() => {
        const userInformation = {
            isEdge,
            isIE,
            isIOS,
            isMobile,
            isMobileSafari,
        };

        store.dispatch({
            type: ActionTypes.USER_AGENT,
            payload: userInformation,
        });
    }, []);

    const user_id = useReactiveVar(userIdVar);
    const {
        data: userData,
        loading: userDataLoading,
        error,
    } = useQuery(GET_USER, {
        fetchPolicy: `network-only`,
        variables: {
            user_id,
        },
    });

    useEffect(() => {
        if (userData) {
            let joinedOrgArray = [];
            const arr: any = [];
            const joined_organization = _get(userData, `user.memberships`, false);
            if (joined_organization) {
                arr.push(joined_organization);
                joinedOrgArray = arr.map((o: any) => ({
                    ...o,
                }));
                setOrganizationData(joinedOrgArray[0]);
            }
        }
    }, [ userData ]);

    useEffect(() => {
        if (_isEmpty(organizationData)) { return; }
        if (organizationData[0].organization !== undefined) {
            currentMembershipVar({
                organization_name: organizationData[0].organization.organization_name,
                organization_id: organizationData[0].organization.organization_id,
                organization_email: organizationData[0].organization.email,
            });
        }
    }, [ organizationData, user_id ]);

    return ((isIE <= 11 && isIE !== false) ? <BrowserList /> :
        <>
            <Grid item>
                <NavBar />
            </Grid>
            <Grid
                item
                style={{
                    flex: 1,
                }}>
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={() => <Home />} />
                    <Route
                        path="/library"
                        render={() => <>
                            <iframe
                                src={`${ENDPOINT}?org_id=${currentOrganization.organization_id}#/library`}
                                allow="microphone"
                                frameBorder="0"
                                style={{
                                    width: `100%`,
                                    height: `100%`,
                                }}
                            />
                        </>} />
                    <Route
                        path="/badanamu-content"
                        render={() => <>
                            <iframe
                                src={`${ENDPOINT}?org_id=${currentOrganization.organization_id}#/library/my-content-list?program_group=BadaESL&order_by=-update_at&page=1`}
                                frameBorder="0"
                                style={{
                                    width: `100%`,
                                    height: `100%`,
                                }}
                            />
                        </>} />
                    <Route
                        path="/schedule"
                        render={() => <>
                            <iframe
                                src={`${ENDPOINT}?org_id=${currentOrganization.organization_id}#/schedule/calendar`}
                                frameBorder="0"
                                style={{
                                    width: `100%`,
                                    height: `100%`,
                                }}
                            />
                        </>} />
                    <Route
                        path="/assessments"
                        render={() => <>
                            <iframe
                                src={`${ENDPOINT}?org_id=${currentOrganization.organization_id}#/assessments/assessment-list`}
                                frameBorder="0"
                                style={{
                                    width: `100%`,
                                    height: `100%`,
                                }}
                            />
                        </>} />
                    <Route
                        path="/reports"
                        render={() => <>
                            <iframe
                                src={`${ENDPOINT}?org_id=${currentOrganization.organization_id}#/report/achievement-list`}
                                frameBorder="0"
                                style={{
                                    width: `100%`,
                                    height: `100%`,
                                }}
                            />
                        </>} />
                    <Route
                        exact
                        path="/admin/organizations/:organizationId/edit">
                        <Layout>
                            <EditOrganization />
                        </Layout>
                    </Route>
                    <Route path="/admin/organizations/create">
                        <Layout>
                            <Organization />
                        </Layout>
                    </Route>
                    <Route path="/admin/organizations">
                        <Layout>
                            <AllOrganization />
                        </Layout>
                    </Route>
                    <Route path="/admin/users">
                        <Layout>
                            <User />
                        </Layout>
                    </Route>
                    <Route path="/admin/roles">
                        <Layout>
                            <RoleTable />
                        </Layout>
                    </Route>
                    <Route path="/admin/schools">
                        <Layout>
                            <SchoolTable />
                        </Layout>
                    </Route>
                    <Route path="/admin/classes/:classId/roster">
                        <Layout>
                            <ClassRosterTable />
                        </Layout>
                    </Route>
                    <Route path="/admin/classes">
                        <Layout>
                            <ClassesPage />
                        </Layout>
                    </Route>
                    <Route path="/admin/programs">
                        <Layout>
                            <ProgramsPage />
                        </Layout>
                    </Route>
                    <Route path="/admin/grades">
                        <Layout>
                            <Grades />
                        </Layout>
                    </Route>
                    <Route path="/admin/subjects">
                        <Layout>
                            <SubjectsPage />
                        </Layout>
                    </Route>
                    <Route path="/admin/age-ranges">
                        <Layout>
                            <AgeRanges />
                        </Layout>
                    </Route>
                    <Route path="/admin">
                        <Layout>
                            <User />
                        </Layout>
                    </Route>
                    <Route path="/super-admin/content-library">
                        <Layout>
                            <SuperAdminContentLibraryTable />
                        </Layout>
                    </Route>
                    <Route render={() => <Home />} />
                </Switch>
            </Grid>
        </>
    );
}

export default App;
