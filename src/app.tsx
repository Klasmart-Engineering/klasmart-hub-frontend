import {
    currentMembershipVar,
    userIdVar,
} from "./cache";
import NavBar from "./components/styled/navbar/navbar";
import { getCNEndpoint } from "./config";
import { GET_USER } from "./operations/queries/getUser";
import AdminLayout from "./pages/admin/AdminLayout";
import ClassRosterTable from "./pages/admin/ClassRoster/ClassRosterTable";
import GradeTable from "./pages/admin/Grade/GradesTable";
import Layout from "./pages/admin/Layout";
import AllOrganization from "./pages/admin/Organization/AllOrganitation";
import EditOrganization from "./pages/admin/Organization/EditOrganization";
import Organization from "./pages/admin/Organization/Organization";
import RoleTable from "./pages/admin/Role/RoleTable";
import ClasessTable from "./pages/admin/School/ClassesTable";
import ProgramTable from "./pages/admin/School/ProgramsTable";
import SchoolTable from "./pages/admin/School/SchoolTable";
import User from "./pages/admin/User";
import { BrowserList } from "./pages/browserList";
import Home from "./pages/home/home";
import SuperAdminContentLibraryTable from "./pages/superAdmin/LibraryContent/Table";
import { ActionTypes } from "./store/actions";
import { redirectIfUnauthorized } from "./utils/redirectIfUnauthorized";
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

export function App() {
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
    } = useQuery(GET_USER,
        {
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
                        <AdminLayout>
                            <EditOrganization />
                        </AdminLayout>
                    </Route>
                    <Route path="/admin/organizations/create">
                        <AdminLayout>
                            <Organization />
                        </AdminLayout>
                    </Route>
                    <Route path="/admin/organizations">
                        <AdminLayout>
                            <AllOrganization />
                        </AdminLayout>
                    </Route>
                    <Route path="/admin/users">
                        <AdminLayout>
                            <User />
                        </AdminLayout>
                    </Route>
                    <Route path="/admin/roles">
                        <AdminLayout>
                            <RoleTable />
                        </AdminLayout>
                    </Route>
                    <Route path="/admin/schools">
                        <AdminLayout>
                            <SchoolTable />
                        </AdminLayout>
                    </Route>
                    <Route path="/admin/classes/:classId/roster">
                        <AdminLayout>
                            <ClassRosterTable />
                        </AdminLayout>
                    </Route>
                    <Route path="/admin/classes">
                        <AdminLayout>
                            <ClasessTable />
                        </AdminLayout>
                    </Route>
                    <Route path="/admin/programs">
                        <AdminLayout>
                            <ProgramTable />
                        </AdminLayout>
                    </Route>
                    <Route path="/admin/grades">
                        <AdminLayout>
                            <GradeTable />
                        </AdminLayout>
                    </Route>
                    <Route path="/admin">
                        <AdminLayout>
                            <User />
                        </AdminLayout>
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
