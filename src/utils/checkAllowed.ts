import { useGetOrganizationMembershipsPermissions } from "@/api/organizationMemberships";
import { useCurrentOrganizationMembership } from "@/store/organizationMemberships";
import { PermissionId } from "@/utils/permissions/permissionDetails";
import {
    useEffect,
    useState,
} from "react";

export const checkAllowed = (organizationId: string, permissionId: string) => {
    const { data } = useGetOrganizationMembershipsPermissions();
    return (data?.me.memberships ?? [])
        .filter((membership) => membership.organization_id === organizationId)
        .flatMap((membership) => (membership.roles ?? []).flatMap((role) => role.permissions.map((permission) => permission.permission_id)))
        .includes(permissionId);
};

export const usePermission = (permissionId: PermissionId, defaultValue = false) => {
    const currentOrganizationMembership = useCurrentOrganizationMembership();
    const organizationId = currentOrganizationMembership?.organization_id ?? ``;
    const allowed = checkAllowed(organizationId, permissionId);
    useEffect(() => setPermissionState(allowed), [ allowed ]);
    const [ permissionState, setPermissionState ] = useState(defaultValue);
    return permissionState;
};
