import {
    Group,
    Permission,
    PermissionDetail,
    PermissionsCategory,
    Role,
} from "@/pages/admin/Role/CreateRole";
import { systemRoles } from "@/utils/permissions/systemRoles";

/**
 * Takes a list of roles and permissions.
 * @param roles A list of roles with their permissions
 * @returns a list of unique permissions
 */
export const uniquePermissions = (roles: Role[]): Permission[] => {
    const permissions: Permission[] = [];

    roles
        .filter((e: Role) => systemRoles.includes(e.role_name))
        .forEach((role: Role, roleIndex: number) => {
            role.permissions?.forEach(
                (permission: Permission, permissionIndex: number) => {
                    const permissionId =
                        roles[roleIndex].permissions[permissionIndex]
                            .permission_id;
                    const permissionGroup =
                        roles[roleIndex].permissions[permissionIndex]
                            .permission_group;
                    const permissionLevel =
                        roles[roleIndex].permissions[permissionIndex]
                            .permission_level;
                    const permissionCategory =
                        roles[roleIndex].permissions[permissionIndex]
                            .permission_category;
                    const permissionDescription =
                        roles[roleIndex].permissions[permissionIndex]
                            .permission_description;

                    const index = permissions.findIndex(
                        (permission: Permission) =>
                            permission.permission_id === permissionId,
                    );

                    if (
                        index === -1 &&
                        permissionId &&
                        permissionGroup &&
                        permissionCategory
                    ) {
                        permissions.push({
                            permission_id: permissionId,
                            permission_name: permissionId,
                            permission_group: permissionGroup,
                            permission_level: permissionLevel,
                            permission_category: permissionCategory,
                            permission_description: permissionDescription,
                            levels: [ permissionLevel ],
                        });
                    } else {
                        if (
                            permissions[index] &&
                            !permissions[index]?.levels?.includes(
                                permissionLevel,
                            )
                        ) {
                            permissions[index]?.levels?.push(permissionLevel);
                        }
                    }
                },
            );
        });

    return permissions;
};

/**
 * Creates an array of object with the correct attributes to display all permissions and groups
 * @param permissions a list of unique permissions
 * @returns a list with category, groups and permission details attributes to conform
 * the Select permissions step in the role creation process, e.g:
 [
  {
    "category": "Edit Password",
    "groups": [
      {
        "group": "Org Admin",
        "open": false,
        "selectAll": false,
        "permissionDetails": [
          {
            "permissionName": "change_owner_10880",
            "permissionId": "change_owner_10880",
            "permissionDescription": "Gives users access to change owners",
            "checked": false,
            "role": "",
            "roles": ["Organization Admin", "Teacher"]
          }
        ]
      }
    ]
   }
 ]
 */
export const sectionHandler = (
    permissions: Permission[] = [],
): PermissionsCategory[] => {
    const data: PermissionsCategory[] = [];

    permissions.forEach((permission: Permission, i: number) => {
        const category = permissions[i].permission_category;
        const group = permissions[i].permission_group;
        const categoryIndex = data.findIndex(
            (item: PermissionsCategory) => item.category === category,
        );

        if (categoryIndex === -1) {
            data.push({
                category,
                groups: [
                    {
                        group: group,
                        open: false,
                        selectAll: false,
                        permissionDetails: [],
                    },
                ],
            });
        } else {
            data[categoryIndex].groups.forEach(() => {
                const permissionIndex = data[categoryIndex].groups.findIndex(
                    (item: Group) => item.group === group,
                );

                if (permissionIndex === -1) {
                    data[categoryIndex].groups.push({
                        group: group,
                        open: false,
                        selectAll: false,
                        permissionDetails: [],
                    });
                }
            });
        }
    });

    permissions.forEach((permission: Permission, permissionIndex: number) => {
        const uniquePermission = permissions[permissionIndex];

        data.forEach((role: PermissionsCategory, roleIndex: number) => {
            const category = data[roleIndex].category;

            data[roleIndex].groups.forEach(
                (group: Group, sectionIndex: number) => {
                    const permission = data[roleIndex].groups[sectionIndex];

                    if (!permission.permissionDetails.length) {
                        if (
                            category === uniquePermission.permission_category &&
                            permission.group ===
                                uniquePermission.permission_group
                        ) {
                            data[roleIndex].groups[sectionIndex][
                                `permissionDetails`
                            ] = [
                                {
                                    permissionName:
                                        uniquePermission.permission_name,
                                    permissionId:
                                        uniquePermission.permission_id,
                                    permissionDescription:
                                        uniquePermission.permission_description,
                                    checked: false,
                                    levels: uniquePermission.levels,
                                },
                            ];
                        }
                    } else {
                        const permissionDetailsIndex = data[roleIndex].groups[
                            sectionIndex
                        ].permissionDetails.findIndex(
                            (item: PermissionDetail) =>
                                item.permissionId ===
                                uniquePermission.permission_id,
                        );

                        if (permissionDetailsIndex === -1) {
                            if (
                                category ===
                                    uniquePermission.permission_category &&
                                permission.group ===
                                    uniquePermission.permission_group
                            ) {
                                data[roleIndex].groups[
                                    sectionIndex
                                ].permissionDetails.push({
                                    permissionName:
                                        uniquePermission.permission_name,
                                    permissionId:
                                        uniquePermission.permission_id,
                                    permissionDescription:
                                        uniquePermission.permission_description,
                                    checked: false,
                                    levels: uniquePermission.levels,
                                });
                            }
                        }
                    }
                },
            );
        });
    });

    return data;
};
