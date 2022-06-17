/* eslint-disable react/prop-types */
import {
    PermissionOption,
    usePermission,
} from "@/utils/permissions";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    permissions: PermissionOption;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
    const { permissions } = props;
    const { hasPermission, loading } = usePermission(permissions, true);
    const canViewPage = hasPermission || loading;

    if (!canViewPage) return (
        <Navigate
            replace
            to="/"
        />
    );

    return (
        <>
            {props.children}
        </>
    );
};

export default ProtectedRoute;
