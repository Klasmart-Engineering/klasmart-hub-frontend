import { permissions } from "./permissions";

interface PermissionDetails {
    name: string;
    group: string;
    category: string;
    level: string;
    description: string;
}

export const permissionDetails = new Set<PermissionDetails>(permissions);
