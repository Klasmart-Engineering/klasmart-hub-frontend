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
    setToWidgetDashboard: () => void;
    setToOriginalDashboard: () => void;
    loading: boolean;
    hasPermissionToViewWidgetDashboard: boolean;
    view: WidgetView;
}

export const useDashboardMode = () : UseDashboardModeReturnType => {
    const currentOrganizationMembership = useCurrentOrganizationMembership();
    const { hasPermission: teacherPermission = false, loading: teacherLoading } = usePermission(`view_my_class_users_40112`, true);
    const { hasPermission: studentPermission = false, loading: studentLoading } = usePermission(`view_teacher_feedback_670`, true);

    const loading = teacherLoading || studentLoading;

    const hasPermission = teacherPermission || studentPermission;

    const view = useMemo(() => teacherPermission ? WidgetView.TEACHER : studentPermission ? WidgetView.STUDENT : WidgetView.DEFAULT, [ teacherPermission, studentPermission ]);

    const organizationId = currentOrganizationMembership?.organization_id;
    const userId = currentOrganizationMembership?.user_id;
    const stateFamilyId = currentOrganizationMembership ? `${ userId }__${ organizationId }` : ``;
    const [ dashboardMode, setDashboardMode ] = useRecoilState(dashboardModeStateFamily(stateFamilyId));

    const hasPermissionToViewWidgetDashboard = useMemo(() => hasPermission && process.env.SHOW_REPORT_CARDS === `true`, [ teacherPermission, studentPermission ]);

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
        setToWidgetDashboard,
        setToOriginalDashboard,
        loading,
        hasPermissionToViewWidgetDashboard,
        view,
    };
};
