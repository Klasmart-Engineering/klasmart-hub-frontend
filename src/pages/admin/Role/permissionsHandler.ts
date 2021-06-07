import {
    Group,
    Permission,
    PermissionsCategory,
    Role,
} from "@/pages/admin/Role/CreateAndEditRoleDialog";
import { systemRoles } from "@/utils/permissions";

/**
 * Takes a list of roles and permissions.
 * @param roles A list of roles with their permissions
 * @returns a list of unique permissions
 */
export const uniquePermissions = (roles: Role[]): Permission[] => {
    const permissions: Permission[] = [];

    roles
        ?.filter((role) => systemRoles.includes(role.role_name))
        .forEach((role) => {
            role.permissions?.forEach((permission) => {
                const permissionId = permission.permission_id;
                const permissionGroup = permission.permission_group;
                const permissionLevel = permission.permission_level;
                const permissionCategory = permission.permission_category;
                const permissionDescription = permission.permission_description;

                const index = permissions.findIndex(
                    (permission: Permission) => permission.permission_id === permissionId,
                );

                if (
                    index === -1 &&
                    permissionId &&
                    permissionGroup &&
                    permissionLevel &&
                    permissionCategory &&
                    permissionDescription
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
                }
            });
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
export const sectionHandler = (permissions: Permission[] = []): PermissionsCategory[] => {
    const data: PermissionsCategory[] = [];

    permissions?.forEach((permission) => {
        const category = permission.permission_category;
        const group = permission.permission_group;
        const categoryIndex = data.findIndex((item) => item.category === category);

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
                const permissionIndex = data[categoryIndex].groups.findIndex((item) => item.group === group);

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

    permissions?.forEach((permission) => {
        const uniquePermission = permission;

        data.forEach((role, roleIndex) => {
            const category = role.category;

            role.groups.forEach((group, sectionIndex) => {
                const permission = group;

                if (!permission.permissionDetails.length) {
                    if (
                        category === uniquePermission.permission_category &&
                        permission.group === uniquePermission.permission_group
                    ) {
                        data[roleIndex].groups[sectionIndex][`permissionDetails`] = [
                            {
                                permissionName: uniquePermission.permission_name,
                                permissionId: uniquePermission.permission_id,
                                permissionDescription: uniquePermission.permission_description,
                                checked: false,
                                levels: uniquePermission.levels,
                            },
                        ];
                    }
                } else {
                    const permissionDetailsIndex = group.permissionDetails.findIndex(
                        (item) => item.permissionId === uniquePermission.permission_id,
                    );

                    if (permissionDetailsIndex === -1) {
                        if (
                            category === uniquePermission.permission_category &&
                            permission.group === uniquePermission.permission_group
                        ) {
                            data[roleIndex].groups[sectionIndex].permissionDetails.push({
                                permissionName: uniquePermission.permission_name,
                                permissionId: uniquePermission.permission_id,
                                permissionDescription: uniquePermission.permission_description,
                                checked: false,
                                levels: uniquePermission.levels,
                            });
                        }
                    }
                }
            });
        });
    });

    return data;
};

export const permissionsCategoriesHandler = (permissionCategories: PermissionsCategory[]) => {
    return permissionCategories.reduce((permissionsCategories: PermissionsCategory[], permissionsCategory) => {
        const hasPermissions = permissionsCategory.groups.reduce((groups: Group[], group) => {
            if (group.permissionDetails.some((permissionDetail) => permissionDetail.checked)) {
                groups.push(group);
            }

            return groups;
        }, []);

        if (hasPermissions.length) {
            permissionsCategories.push(permissionsCategory);
        }

        return permissionsCategories;
    }, []) as PermissionsCategory[];
};
