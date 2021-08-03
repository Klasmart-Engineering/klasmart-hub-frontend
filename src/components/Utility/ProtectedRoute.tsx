import {
    PermissionOption,
    usePermission,
} from "@/utils/permissions";
import React from "react";
import {
    Redirect,
    Route,
    RouteProps,
} from "react-router-dom";

interface Props extends Omit<RouteProps, "render"> {
    permissions: PermissionOption;
}

export default function ProtectedRoute (props: Props) {
    const {
        children,
        permissions,
        ...rest
    } = props;
    const { hasPermission, loading } = usePermission(permissions, true);
    const canViewPage = hasPermission || loading;

    return (
        <Route
            {...rest}
            render={() => canViewPage ? children : <Redirect to="/" />}
        />
    );
}
