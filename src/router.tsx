import { currentMembershipVar } from "./cache";
import { getCNEndpoint } from "./config";
import ClassesPage from "./pages/admin/classes";
import Grades from "./pages/admin/grades";
import Layout from "./pages/admin/Layout";
import AllOrganization from "./pages/admin/Organization/AllOrganitation";
import EditOrganization from "./pages/admin/Organization/EditOrganization";
import Organization from "./pages/admin/Organization/Organization";
import ProgramsPage from "./pages/admin/programs";
import RoleTable from "./pages/admin/Role/RoleTable";
import SchoolsPage from "./pages/admin/schools";
import SubjectsPage from "./pages/admin/subjects";
import User from "./pages/admin/User";
import { BrowserList } from "./pages/browserList";
import Home from "./pages/home/home";
import SuperAdminContentLibraryTable from "./pages/superAdmin/LibraryContent/Table";
import { redirectIfUnauthorized } from "./utils/redirectIfUnauthorized";
import AgeRanges from "@/pages/admin/age-ranges/index";
import { useReactiveVar } from "@apollo/client/react";
import React,
{ useEffect } from "react";
import { isIE } from "react-device-detect";
import {
    Route,
    Switch,
    useLocation,
} from "react-router-dom";

const ENDPOINT = getCNEndpoint();

export default function Router ()  {
    const location = useLocation().pathname;
    useEffect(() => { redirectIfUnauthorized(); }, [ location ]);
    const currentOrganization = useReactiveVar(currentMembershipVar);

    return ((isIE <= 11 && isIE !== false) ? <BrowserList /> :
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
                    <SchoolsPage />
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
    );
}
