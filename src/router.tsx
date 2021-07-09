import AgeRangesPage from "@/pages/admin/age-ranges";
import ClassesPage from "@/pages/admin/classes";
import Grades from "@/pages/admin/grades";
import Layout from "@/pages/admin/Layout";
import OrganizationsPage from "@/pages/admin/organizations";
import EditOrganizationPage from "@/pages/admin/organizations/[id]/edit";
import CreateOrganizationPage from "@/pages/admin/organizations/create";
import ProgramsPage from "@/pages/admin/programs";
import RolesPage from "@/pages/admin/roles";
import SchoolsPage from "@/pages/admin/schools";
import SubjectsPage from "@/pages/admin/subjects";
import UsersPage from "@/pages/admin/users";
import AssessmentsPage from "@/pages/assessments";
import { BrowserList } from "@/pages/browserList";
import HomePage from "@/pages/index";
import BadanamuContentPage from "@/pages/library/badanamu-content";
import MoreFeaturedContentPage from "@/pages/library/more-featured-content";
import OrganizationContentPage from "@/pages/library/organization-content";
import ReportsPage from "@/pages/reports";
import SchedulePage from "@/pages/schedule";
import SuperAdminContentLibraryTable from "@/pages/superAdmin/LibraryContent/Table";
import { redirectIfUnauthorized } from "@/utils/redirectIfUnauthorized";
import React,
{ useEffect } from "react";
import { isIE } from "react-device-detect";
import {
    Redirect,
    Route,
    Switch,
    useLocation,
} from "react-router-dom";

interface Props {
}

export default function Router (props: Props)  {
    const location = useLocation().pathname;
    useEffect(() => { redirectIfUnauthorized(); }, [ location ]);

    return isIE
        ? <BrowserList />
        : <Switch>
            <Route
                exact
                path="/"
            >
                <HomePage />
            </Route>
            <Route
                exact
                path="/library"
            >
                <Redirect to="/library/organization-content" />
            </Route>
            <Route path="/library/organization-content">
                <OrganizationContentPage />
            </Route>
            <Route path="/library/badanamu-content">
                <BadanamuContentPage />
            </Route>
            <Route path="/library/more-featured-content">
                <MoreFeaturedContentPage />
            </Route>
            <Route path="/schedule">
                <SchedulePage />
            </Route>
            <Route path="/assessments">
                <AssessmentsPage />
            </Route>
            <Route path="/reports">
                <ReportsPage />
            </Route>
            <Route
                exact
                path="/admin/organizations/:organizationId/edit"
            >
                <Layout>
                    <EditOrganizationPage />
                </Layout>
            </Route>
            <Route path="/admin/organizations/create">
                <Layout>
                    <CreateOrganizationPage />
                </Layout>
            </Route>
            <Route path="/admin/organizations">
                <Layout>
                    <OrganizationsPage />
                </Layout>
            </Route>
            <Route path="/admin/users">
                <Layout>
                    <UsersPage />
                </Layout>
            </Route>
            <Route path="/admin/roles">
                <Layout>
                    <RolesPage />
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
                    <AgeRangesPage />
                </Layout>
            </Route>
            <Route path="/admin">
                <Layout>
                    <UsersPage />
                </Layout>
            </Route>
            <Route path="/super-admin/content-library">
                <Layout>
                    <SuperAdminContentLibraryTable />
                </Layout>
            </Route>
            <Route>
                <HomePage />
            </Route>
        </Switch>;
}
