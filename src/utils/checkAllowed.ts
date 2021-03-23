import { currentMembershipVar } from "@/cache";
import { GET_ALL_USER_PERMISSIONS } from "@/operations/queries/getAllUserPermissions";
import { OrganizationMembership } from "@/types/graphQL";
import { PermissionId } from "@/utils/permissions/permissionDetails";
import {
    useQuery,
    useReactiveVar,
} from "@apollo/client";
import {
    useEffect,
    useState,
} from "react";

export interface GetAllUserPermissionsRequest {}

export interface GetAllUserPermissionsResponse {
    me: {
        memberships: OrganizationMembership[];
    };
}

export const checkAllowed = (organizationId: string, permissionId: string) => {
    const { data } = useQuery<GetAllUserPermissionsResponse, GetAllUserPermissionsRequest>(GET_ALL_USER_PERMISSIONS);
    return (data?.me.memberships ?? [])
        .filter((membership) => membership.organization_id === organizationId)
        .flatMap((membership) => (membership.roles ?? []).flatMap((role) => role.permissions.map((permission) => permission.permission_id)))
        .includes(permissionId);
};

export const usePermission = (permissionId: PermissionId, defaultValue = false) => {
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const allowed = checkAllowed(organization_id, permissionId);
    useEffect(() => setPermissionState(allowed), [ allowed ]);
    const [ permissionState, setPermissionState ] = useState(defaultValue);
    return permissionState;
};
