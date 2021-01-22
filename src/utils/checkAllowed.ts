import { currentMembershipVar } from "@/cache";
import { CHECK_ALLOWED } from "@/operations/queries/checkAllowedPermission";
import { User } from "@/types/graphQL";
import { PermissionId } from "@/utils/permissions/permissionDetails";
import {
    useQuery,
    useReactiveVar,
} from "@apollo/client";
import {
    useEffect,
    useState,
} from "react";

export interface CheckAllowedRequest {
    organization_id: string;
    permission_name: string;
}

export interface CheckAllowedResponse {
    me: User;
}

export const checkAllowed = (organizationId: string, permissionName: string) => {
    const { data } = useQuery<CheckAllowedResponse, CheckAllowedRequest>(CHECK_ALLOWED, {
        fetchPolicy: `network-only`,
        variables: {
            organization_id: organizationId,
            permission_name: permissionName,
        },
    });

    return data;
};

export const usePermission = (permissionId: PermissionId, defaultValue = false) => {
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const allowed = checkAllowed(organization_id, permissionId);
    useEffect(() => {
        setPermissionState(!!allowed?.me?.membership?.checkAllowed);
    }, [ allowed ]);
    const [ permissionState, setPermissionState ] = useState(defaultValue);
    return permissionState;
};
