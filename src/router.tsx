import GeneratedData from "./components/User/Warning/GeneratedData";
import { updatePageEvent } from "./firebase/config";
import UserDeleteConfirmationPage from "./pages/admin/users/user-delete-confirmation";
import { authClient } from "@/api/auth/client";
import ErrorBoundary from "@/components/Common/ErrorBoundary";
import ErrorPage from "@/components/Common/ErrorPage";
import ProtectedRoute from "@/components/Utility/ProtectedRoute";
import { useFeatureFlags } from "@/feature-flag/utils";
import ContentLibraryLayout from "@/layout/ContentLibrary";
import AgeRangesPage from "@/pages/admin/age-ranges";
import ClassesPage from "@/pages/admin/classes";
import GradesPage from "@/pages/admin/grades";
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
import StudentReport from "@/pages/studentReport";
import SuperAdminContentLibraryTable from "@/pages/superAdmin/LibraryContent/Table";
import { redirectToAuth } from "@/utils/routing";
import {
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    Navigate,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";

interface Props {
}

export default function Router (props: Props) {
    const [ timeUntilExpiry, setTimeUntilExpiry ] = useState(0);
    const { teacherStudentProgressReport } = useFeatureFlags();

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
        updatePageEvent();
        redirectIfUnauthenticated();
    }, [ location ]);

    return (
        <ErrorBoundary
            errorComponent={(
                <ErrorPage />
            )}
        >
            <Routes>
                <Route
                    path="/*"
                    element={<HomePage />}
                />
                <Route
                    path="library"
                    element={<ContentLibraryLayout />}
                >
                    <Route
                        path="organization-content/*"
                        element={<OrganizationContentPage />}
                    />
                    <Route
                        path="badanamu-content/*"
                        element={<BadanamuContentPage />}
                    />
                    <Route
                        path="more-featured-content/*"
                        element={<MoreFeaturedContentPage />}
                    />
                </Route>
                <Route
                    path="/schedule/*"
                    element={<SchedulePage />}
                />
                <Route
                    path="/assessments/*"
                    element={<AssessmentsPage />}
                />
                <Route
                    path="/reports/*"
                    element={<ReportsPage />}
                />
                {teacherStudentProgressReport && (
                    <Route
                        path="/student-report"
                        element={(
                            <ProtectedRoute permissions={`report_student_progress_teacher_660`}>
                                <StudentReport />
                            </ProtectedRoute>
                        )}
                    />
                )}
                <Route
                    path="/admin/organizations/:organizationId/edit"
                    element={(
                        <ProtectedRoute
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
                    )}
                />
                <Route
                    path="/admin/organizations/create"
                    element={(
                        <ProtectedRoute permissions={`create_own_organization_10220`}>
                            <Layout>
                                <CreateOrganizationPage />
                            </Layout>
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/admin/organizations"
                    element={(
                        <ProtectedRoute
                            permissions={{
                                AND: [ `organizational_profile_10100` ],
                                OR: [ `view_this_organization_profile_10110`, `view_my_organization_profile_10111` ],
                            }}
                        >
                            <Layout>
                                <OrganizationsPage />
                            </Layout>
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/admin/roles"
                    element={(
                        <ProtectedRoute permissions={`roles_30100`}>
                            <Layout>
                                <RolesPage />
                            </Layout>
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/admin/schools"
                    element={(
                        <ProtectedRoute permissions={[ `academic_profile_20100`, `define_school_program_page_20101` ]}>
                            <Layout>
                                <SchoolsPage />
                            </Layout>
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/admin/classes"
                    element={(
                        <ProtectedRoute permissions={[ `academic_profile_20100`, `define_class_page_20104` ]}>
                            <Layout>
                                <ClassesPage />
                            </Layout>
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/admin/classes"
                    element={(
                        <ProtectedRoute
                            permissions={[ `academic_profile_20100`, `define_class_page_20104` ]}
                        >
                            <Layout>
                                <ClassesPage />
                            </Layout>
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/admin/programs"
                    element={(
                        <ProtectedRoute
                            permissions={[ `academic_profile_20100`, `define_program_page_20105` ]}
                        >
                            <Layout>
                                <ProgramsPage />
                            </Layout>
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/admin/grades"
                    element={(
                        <ProtectedRoute
                            permissions={[ `academic_profile_20100`, `define_grade_page_20103` ]}
                        >
                            <Layout>
                                <GradesPage />
                            </Layout>
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/admin/subjects"
                    element={(
                        <ProtectedRoute
                            permissions={[ `academic_profile_20100`, `define_subject_page_20106` ]}
                        >
                            <Layout>
                                <SubjectsPage />
                            </Layout>
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/admin/age-ranges"
                    element={(
                        <ProtectedRoute
                            permissions={[ `academic_profile_20100`, `define_age_ranges_page_20102` ]}
                        >
                            <Layout>
                                <AgeRangesPage />
                            </Layout>
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/admin/users"
                    element={(
                        <ProtectedRoute
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
                    )}
                />
                <Route
                    path="/super-admin/content-library"
                    element={(
                        <Layout>
                            <SuperAdminContentLibraryTable />
                        </Layout>
                    )}
                />
                <Route
                    path="/user-deletion-warning"
                    element={<GeneratedData />}
                />
                <Route
                    path="/user-deletion-confirmation"
                    element={<UserDeleteConfirmationPage />}
                />
                <Route
                    path="/*"
                    element={<HomePage />}
                />
            </Routes>
        </ErrorBoundary>
    );
}
