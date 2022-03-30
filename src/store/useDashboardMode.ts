import { useQueryMyUser } from "@/api/myUser";
import { WidgetView } from "@/components/Dashboard/WidgetManagement/defaultWidgets";
import { useCurrentOrganizationMembership } from "@/store/organizationMemberships";
import { usePermission } from "@/utils/permissions";
import {
    useEffect,
    useMemo,
} from "react";
import {
    atomFamily,
    useRecoilState,
} from "recoil";
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

const atomFamilyOptions = {
    key: `dashboardModeState`,
    default: undefined,
};

const persistedAtomFamilyOptions = {
    key: `dashboardModePersistState`,
    default: undefined,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    effects_UNSTABLE: [ persistAtom ],
};

const dashboardModeAtomFamily = atomFamily<DashboardMode | undefined, string>(atomFamilyOptions);
const persistedDashboardModeAtomFamily = atomFamily<DashboardMode | undefined, string>(persistedAtomFamilyOptions);

export enum DashboardMode {
    ORIGINAL = `original`,
    WIDGET = `widget-dashboard`,
}

interface UseDashboardModeReturnType {
    dashboardMode: DashboardMode | undefined;
    showDashboardNoticeToggle: boolean;
    setToWidgetDashboard: () => void;
    setToOriginalDashboard: () => void;
    loading: boolean;
    view: WidgetView;
}

export const useDashboardMode = (): UseDashboardModeReturnType => {
    const { data: myUserData, loading: myUserLoading } = useQueryMyUser();
    const currentUser = myUserData?.myUser.node;
    const currentOrganizationMembership = useCurrentOrganizationMembership();
    const { hasPermission: teacherPermission = false, loading: teacherLoading } = usePermission(`view_my_class_users_40112`, true);
    const { hasPermission: studentPermission = false, loading: studentLoading } = usePermission(`view_teacher_feedback_670`, true);

    const view = useMemo(() => teacherPermission ? WidgetView.TEACHER : studentPermission ? WidgetView.STUDENT : WidgetView.DEFAULT, [ teacherPermission, studentPermission ]);

    const organizationId = currentOrganizationMembership?.organization_id;
    const userId = currentOrganizationMembership?.user_id;
    const stateFamilyId = currentOrganizationMembership ? `${ userId }__${ organizationId }` : ``;

    const hasPermissionLoading = teacherLoading || studentLoading || myUserLoading;

    const hasPermissionToViewWidgetDashboard = useMemo(() => {
        const teacherAllowed = teacherPermission && process.env.TEACHER_WIDGET_DASHBOARD_SHOW === `true`;
        const studentAllowed = studentPermission && process.env.STUDENT_WIDGET_DASHBOARD_SHOW === `true`;

        return teacherAllowed || studentAllowed;
    }, [ teacherPermission, studentPermission ]);

    const showDashboardNoticeToggle = useMemo(() => {
        if (teacherPermission) return process.env.TEACHER_WIDGET_DASHBOARD_USE_MOCK_DATA === `true`;
        if (studentPermission) return process.env.STUDENT_WIDGET_DASHBOARD_USE_MOCK_DATA === `true`;

        return false;
    }, [ teacherPermission, studentPermission ]);

    const dashboardModeStateFamily = showDashboardNoticeToggle ? persistedDashboardModeAtomFamily(stateFamilyId) : dashboardModeAtomFamily(stateFamilyId);
    const [ dashboardMode, setDashboardMode ] = useRecoilState(dashboardModeStateFamily);

    const loading = hasPermissionLoading || dashboardMode === undefined;

    useEffect(() => {
        if(dashboardMode !== undefined || hasPermissionLoading) return;

        setDashboardMode(hasPermissionToViewWidgetDashboard ? DashboardMode.WIDGET : DashboardMode.ORIGINAL);
    }, [
        hasPermissionLoading,
        hasPermissionToViewWidgetDashboard,
        dashboardMode,
    ]);

    const setToWidgetDashboard = () => {
        if (!hasPermissionToViewWidgetDashboard) return;
        setDashboardMode(DashboardMode.WIDGET);
    };

    const setToOriginalDashboard = () => setDashboardMode(DashboardMode.ORIGINAL);

    return {
        dashboardMode,
        showDashboardNoticeToggle,
        setToWidgetDashboard,
        setToOriginalDashboard,
        loading,
        view,
    };
};
