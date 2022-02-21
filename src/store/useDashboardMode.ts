import { useCurrentOrganizationMembership } from "./organizationMemberships";
import { WidgetView } from "@/components/Dashboard/WidgetManagement/defaultWidgets";
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

export enum DashboardMode {
    ORIGINAL = `original`,
    WIDGET = `widget-dashboard`,
}

export const dashboardModeStateFamily = atomFamily<DashboardMode | undefined, string>({
    key: `dashboardModeState`,
    default: undefined,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    effects_UNSTABLE: [ persistAtom ],
});

interface UseDashboardModeReturnType {
    dashboardMode: DashboardMode | undefined;
    showDashboardNoticeToggle: boolean;
    setToWidgetDashboard: () => void;
    setToOriginalDashboard: () => void;
    loading: boolean;
    view: WidgetView;
}

export const useDashboardMode = () : UseDashboardModeReturnType => {
    const currentOrganizationMembership = useCurrentOrganizationMembership();
    const { hasPermission: teacherPermission = false, loading: teacherLoading } = usePermission(`view_my_class_users_40112`, true);
    const { hasPermission: studentPermission = false, loading: studentLoading } = usePermission(`view_teacher_feedback_670`, true);

    const loading = teacherLoading || studentLoading;

    const view = useMemo(() => teacherPermission ? WidgetView.TEACHER : studentPermission ? WidgetView.STUDENT : WidgetView.DEFAULT, [ teacherPermission, studentPermission ]);

    const organizationId = currentOrganizationMembership?.organization_id;
    const userId = currentOrganizationMembership?.user_id;
    const stateFamilyId = currentOrganizationMembership ? `${ userId }__${ organizationId }` : ``;
    const [ dashboardMode, setDashboardMode ] = useRecoilState(dashboardModeStateFamily(stateFamilyId));

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

    useEffect(() => {
        if(dashboardMode !== undefined || loading) return;

        setDashboardMode(hasPermissionToViewWidgetDashboard ? DashboardMode.WIDGET : DashboardMode.ORIGINAL);
    }, [ hasPermissionToViewWidgetDashboard ]);

    const setToWidgetDashboard = () => {
        if(!hasPermissionToViewWidgetDashboard) return;

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
