import { User } from "@/types/graphQL";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { CHECK_ALLOWED } from "../operations/queries/checkAllowedPermission";

export interface CheckAllowedRequest {
    organization_id: string
    permission_name: string
}

export interface CheckAllowedResponse {
    me: User
}

export const checkAllowed = (organization_id: string, permission_name: string) => {
    const { data } = useQuery<CheckAllowedResponse, CheckAllowedRequest>(CHECK_ALLOWED, {
        fetchPolicy: "network-only",
        variables: {
            organization_id,
            permission_name
        },
    });

    return data;
};

export const getPermissionState = (organizationId: string, permissionId: string, defaultValue = false) => {
    const allowed = checkAllowed(organizationId, permissionId);
    useEffect(() => {
        setPermissionState(!!allowed?.me?.membership?.checkAllowed);
    }, [ allowed ]);
    const [ permissionState, setPermissionState ] = useState(defaultValue);
    return permissionState;
};
