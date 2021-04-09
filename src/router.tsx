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
import { useCurrentOrganization } from "./store/organizationMemberships";
import { redirectIfUnauthorized } from "./utils/redirectIfUnauthorized";
import AgeRanges from "@/pages/admin/age-ranges/index";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React,
{ useEffect } from "react";
import { isIE } from "react-device-detect";
import {
    Redirect,
    Route,
    Switch,
    useLocation,
} from "react-router-dom";

const useStyles = makeStyles((theme) => createStyles({
    iframeContainer: {
        width: `100%`,
        height: `100%`,
    },
}));

const ENDPOINT = getCNEndpoint();

interface Props {
}

export default function Router (props: Props)  {
    const classes = useStyles();
    const location = useLocation().pathname;
    useEffect(() => { redirectIfUnauthorized(); }, [ location ]);
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;

    return ((isIE <= 11 && isIE !== false) ? <BrowserList /> :
        <Switch>
            <Route
                exact
                path="/"
                render={() => <Home />}
            />
            <Route
                exact
                path="/library"
            >
                <Redirect to="/library/organization-content" />
            </Route>
            <Route
                path="/library/organization-content"
                render={() => (
                    <iframe
                        src={`${ENDPOINT}?org_id=${organizationId}#/library`}
                        allow="microphone"
                        frameBorder="0"
                        className={classes.iframeContainer}
                    />
                )}
            />
            <Route
                path="/library/badanamu-content"
                render={() => (
                    <iframe
                        src={`${ENDPOINT}?org_id=${organizationId}#/library/my-content-list?program_group=BadaESL&order_by=-update_at&page=1`}
                        frameBorder="0"
                        className={classes.iframeContainer}
                    />
                )}
            />
            <Route
                path="/library/more-featured-content"
                render={() => (
                    <iframe
                        src={`${ENDPOINT}?org_id=${organizationId}#/library/my-content-list?program_group=More Featured Content&order_by=-update_at&page=1`}
                        frameBorder="0"
                        className={classes.iframeContainer}
                    />
                )}
            />
            <Route
                path="/schedule"
                render={() => (
                    <iframe
                        src={`${ENDPOINT}?org_id=${organizationId}#/schedule/calendar`}
                        frameBorder="0"
                        className={classes.iframeContainer}
                    />
                )}
            />
            <Route
                path="/assessments"
                render={() => (
                    <iframe
                        src={`${ENDPOINT}?org_id=${organizationId}#/assessments/assessment-list`}
                        frameBorder="0"
                        className={classes.iframeContainer}
                    />
                )}
            />
            <Route
                path="/reports"
                render={() => (
                    <iframe
                        src={`${ENDPOINT}?org_id=${organizationId}#/report/achievement-list`}
                        frameBorder="0"
                        className={classes.iframeContainer}
                    />
                )}
            />
            <Route
                exact
                path="/admin/organizations/:organizationId/edit"
            >
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
