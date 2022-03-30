import { authClient } from "@/api/auth/client";
import ProtectedRoute from "@/components/Utility/ProtectedRoute";
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
import HomePage from "@/pages/index";
import BadanamuContentPage from "@/pages/library/badanamu-content";
import MoreFeaturedContentPage from "@/pages/library/more-featured-content";
import OrganizationContentPage from "@/pages/library/organization-content";
import ReportsPage from "@/pages/reports";
import SchedulePage from "@/pages/schedule";
import SuperAdminContentLibraryTable from "@/pages/superAdmin/LibraryContent/Table";
import { redirectToAuth } from "@/utils/routing";
import React,
{
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    Redirect,
    Route,
    Switch,
    useLocation,
} from "react-router-dom";

interface Props {
}

export default function Router (props: Props) {
    const [ timeUntilExpiry, setTimeUntilExpiry ] = useState(0);

    const redirectIfUnauthenticated = useCallback(async () => {
        try {
            const authToken = await authClient.refreshToken();
            setTimeUntilExpiry(authToken.exp * 1000 - Date.now());
        } catch (err) {
            redirectToAuth({
                withParams: true,
            });
        }
    }, [ setTimeUntilExpiry ]);

    useEffect(() => {
        const timeout = setTimeout(redirectIfUnauthenticated, timeUntilExpiry);
        return () => clearTimeout(timeout);
    }, [ redirectIfUnauthenticated, timeUntilExpiry ]);

    const location = useLocation().pathname;
    useEffect(() => {
        redirectIfUnauthenticated();
    }, [ location ]);

    return (
        <Switch>
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
            <ProtectedRoute
                exact
                path="/admin/organizations/:organizationId/edit"
                permissions={{
                    OR: [
                        `edit_this_organization_10330`,
                        {
                            AND: [
                                `organizational_profile_10100`,
                                `view_this_organization_profile_10110`,
                                `edit_my_organization_10331`,
                            ],
                        },
                    ],
                }}
            >
                <Layout>
                    <EditOrganizationPage />
                </Layout>
            </ProtectedRoute>
            <ProtectedRoute
                path="/admin/organizations/create"
                permissions={`create_own_organization_10220`}
            >
                <Layout>
                    <CreateOrganizationPage />
                </Layout>
            </ProtectedRoute>
            <ProtectedRoute
                path="/admin/organizations"
                permissions={{
                    AND: [ `organizational_profile_10100` ],
                    OR: [ `view_this_organization_profile_10110`, `view_my_organization_profile_10111` ],
                }}
            >
                <Layout>
                    <OrganizationsPage />
                </Layout>
            </ProtectedRoute>
            <ProtectedRoute
                path="/admin/roles"
                permissions={`roles_30100`}
            >
                <Layout>
                    <RolesPage />
                </Layout>
            </ProtectedRoute>
            <ProtectedRoute
                path="/admin/schools"
                permissions={[ `academic_profile_20100`, `define_school_program_page_20101` ]}
            >
                <Layout>
                    <SchoolsPage />
                </Layout>
            </ProtectedRoute>
            <ProtectedRoute
                path="/admin/classes"
                permissions={[ `academic_profile_20100`, `define_class_page_20104` ]}
            >
                <Layout>
                    <ClassesPage />
                </Layout>
            </ProtectedRoute>
            <ProtectedRoute
                path="/admin/programs"
                permissions={[ `academic_profile_20100`, `define_program_page_20105` ]}
            >
                <Layout>
                    <ProgramsPage />
                </Layout>
            </ProtectedRoute>
            <ProtectedRoute
                path="/admin/grades"
                permissions={[ `academic_profile_20100`, `define_grade_page_20103` ]}
            >
                <Layout>
                    <Grades />
                </Layout>
            </ProtectedRoute>
            <ProtectedRoute
                path="/admin/subjects"
                permissions={[ `academic_profile_20100`, `define_subject_page_20106` ]}
            >
                <Layout>
                    <SubjectsPage />
                </Layout>
            </ProtectedRoute>
            <ProtectedRoute
                path="/admin/age-ranges"
                permissions={[ `academic_profile_20100`, `define_age_ranges_page_20102` ]}
            >
                <Layout>
                    <AgeRangesPage />
                </Layout>
            </ProtectedRoute>
            <ProtectedRoute
                path={[ `/admin/users`, `/admin` ]}
                permissions={{
                    AND: [ `view_user_page_40101` ],
                    OR: [
                        `view_users_40110`,
                        `view_my_school_users_40111`,
                        `view_my_class_users_40112`,
                    ],
                }}
            >
                <Layout>
                    <UsersPage />
                </Layout>
            </ProtectedRoute>
            <Route path="/super-admin/content-library">
                <Layout>
                    <SuperAdminContentLibraryTable />
                </Layout>
            </Route>
            <Route>
                <HomePage />
            </Route>
        </Switch>
    );
}
