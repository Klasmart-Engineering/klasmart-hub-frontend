import { permissions } from "./permissions";
import { RoleName } from "@/types/graphQL";

export interface PermissionGroup {
    role_name: RoleName;
    permissions: PermissionId[];
}
export type PermissionId = typeof permissions[number]["name"]

interface PermissionDetails {
    name: PermissionId;
    group: string;
    category: string;
    level: string;
    description: string;
}

export const permissionDetails = new Set<PermissionDetails>(permissions);
