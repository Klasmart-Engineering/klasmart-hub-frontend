import { systemRoles } from "./userRoles";
import {
    GetOrganizationMembershipsPermissionsResponse,
    useGetOrganizationMembershipsPermissions,
} from "@/api/organizationMemberships";
import {
    Group,
    Permission,
    PermissionsCategory,
    Role,
} from "@/components/Role/Dialog/CreateEdit";
import { useCurrentOrganizationMembership } from "@/store/organizationMemberships";

export type PermissionId = typeof permissions[number]

export interface PermissionCondition {
    AND?: (PermissionId | PermissionCondition)[];
    OR?: (PermissionId | PermissionCondition)[];
}

export type PermissionOption = PermissionId | PermissionId[] | PermissionCondition

export const permissions = [
    `create_an_organization_account_1`,
    `edit_an_organization_details_5`,
    `live_100`,
    `go_live_101`,
    `attend_live_class_as_a_teacher_186`,
    `attend_live_class_as_a_student_187`,
    `library_200`,
    `create_content_page_201`,
    `unpublished_content_page_202`,
    `pending_content_page_203`,
    `published_content_page_204`,
    `archived_content_page_205`,
    `view_my_unpublished_content_210`,
    `view_my_pending_212`,
    `view_org_pending_213`,
    `view_my_published_214`,
    `view_org_published_215`,
    `view_my_archived_216`,
    `view_org_archived_217`,
    `view_my_school_published_218`,
    `view_my_school_pending_225`,
    `view_my_school_archived_226`,
    `view_all_schools_published_227`,
    `view_all_schools_pending_228`,
    `view_all_schools_archived_229`,
    `create_lesson_material_220`,
    `create_lesson_plan_221`,
    `create_my_schools_content_223`,
    `create_all_schools_content_224`,
    `edit_my_unpublished_content_230`,
    `edit_my_published_content_234`,
    `edit_org_published_content_235`,
    `edit_lesson_material_metadata_and_content_236`,
    `edit_lesson_plan_metadata_237`,
    `edit_lesson_plan_content_238`,
    `edit_my_schools_published_247`,
    `edit_all_schools_published_249`,
    `delete_my_pending_251`,
    `delete_org_pending_content_252`,
    `delete_org_archived_content_253`,
    `remove_org_published_content_254`,
    `delete_my_unpublished_content_240`,
    `delete_my_schools_pending_241`,
    `remove_my_schools_published_242`,
    `delete_my_schools_archived_243`,
    `delete_all_schools_pending_244`,
    `remove_all_schools_published_245`,
    `delete_all_schools_archived_246`,
    `approve_pending_content_271`,
    `reject_pending_content_272`,
    `archive_published_content_273`,
    `republish_archived_content_274`,
    `delete_archived_content_275`,
    `full_content_management_294`,
    `associate_learning_outcomes_284`,
    `create_folder_289`,
    `view_folder_290`,
    `edit_folder_291`,
    `delete_folder_292`,
    `create_asset_page_301`,
    `create_asset_320`,
    `delete_asset_340`,
    `assessments_400`,
    `unpublished_page_402`,
    `pending_page_403`,
    `learning_outcome_page_404`,
    `milestones_page_405`,
    `assessments_page_406`,
    `view_my_unpublished_learning_outcome_410`,
    `view_org_unpublished_learning_outcome_411`,
    `view_my_pending_learning_outcome_412`,
    `view_org_pending_learning_outcome_413`,
    `view_completed_assessments_414`,
    `view_in_progress_assessments_415`,
    `view_published_learning_outcome_416`,
    `view_unpublished_milestone_417`,
    `view_published_milestone_418`,
    `view_org_completed_assessments_424`,
    `view_org_in_progress_assessments_425`,
    `view_school_completed_assessments_426`,
    `view_school_in_progress_assessments_427`,
    `view_my_unpublished_milestone_428`,
    `view_my_pending_milestone_429`,
    `create_learning_outcome_421`,
    `create_milestone_422`,
    `edit_my_unpublished_learning_outcome_430`,
    `edit_org_unpublished_learning_outcome_431`,
    `edit_published_learning_outcome_436`,
    `edit_attendance_for_in_progress_assessment_438`,
    `edit_in_progress_assessment_439`,
    `edit_unpublished_milestone_440`,
    `edit_published_milestone_441`,
    `delete_my_unpublished_learning_outcome_444`,
    `delete_org_unpublished_learning_outcome_445`,
    `delete_my_pending_learning_outcome_446`,
    `delete_org_pending_learning_outcome_447`,
    `delete_published_learning_outcome_448`,
    `delete_unpublished_milestone_449`,
    `delete_published_milestone_450`,
    `approve_pending_learning_outcome_481`,
    `reject_pending_learning_outcome_482`,
    `view_pending_milestone_486`,
    `edit_my_unpublished_milestone_487`,
    `delete_my_unpublished_milestone_488`,
    `delete_org_pending_milestone_489`,
    `delete_my_pending_milestone_490`,
    `approve_pending_milestone_491`,
    `reject_pending_milestone_492`,
    `schedule_500`,
    `create_schedule_page_501`,
    `view_my_calendar_510`,
    `view_org_calendar_511`,
    `view_school_calendar_512`,
    `create_event_520`,
    `create_my_schedule_events_521`,
    `create_my_schools_schedule_events_522`,
    `edit_event_530`,
    `delete_event_540`,
    `schedule_search_582`,
    `reports_600`,
    `teacher_reports_603`,
    `view_reports_610`,
    `view_my_school_reports_611`,
    `view_my_organizations_reports_612`,
    `view_my_reports_614`,
    `report_learning_outcomes_in_categories_616`,
    `report_organization_teaching_load_617`,
    `report_school_teaching_load_618`,
    `report_my_teaching_load_619`,
    `teachers_classes_teaching_time_report_620`,
    `time_assessing_load_report_622`,
    `organization_class_achievements_report_626`,
    `my_student_achievements_report_629`,
    `report_organizations_skills_taught_640`,
    `report_schools_skills_taught_641`,
    `report_my_skills_taught_642`,
    `skills_taught_by_all_teachers_in_this_org_report_643`,
    `report_organizations_class_achievements_646`,
    `report_schools_class_achievements_647`,
    `report_my_class_achievments_648`,
    `report_learning_summary_student_649`,
    `report_learning_summary_teacher_650`,
    `report_learning_summary_school_651`,
    `report_learning_summary_org_652`,
    `learning_summary_report_653`,
    `view_teacher_feedback_670`,
    `organizational_profile_10100`,
    `view_this_organization_profile_10110`,
    `view_my_organization_profile_10111`,
    `create_own_organization_10220`,
    `edit_this_organization_10330`,
    `edit_my_organization_10331`,
    `delete_organization_10440`,
    `join_organization_10881`,
    `academic_profile_20100`,
    `define_school_program_page_20101`,
    `define_age_ranges_page_20102`,
    `define_grade_page_20103`,
    `define_class_page_20104`,
    `define_program_page_20105`,
    `define_subject_page_20106`,
    `view_school_20110`,
    `view_program_20111`,
    `view_age_range_20112`,
    `view_grades_20113`,
    `view_classes_20114`,
    `view_school_classes_20117`,
    `view_my_classes_20118`,
    `view_my_school_20119`,
    `view_subjects_20115`,
    `create_school_20220`,
    `create_program_20221`,
    `create_age_range_20222`,
    `create_grade_20223`,
    `create_class_20224`,
    `add_students_to_class_20225`,
    `add_teachers_to_class_20226`,
    `create_subjects_20227`,
    `edit_school_20330`,
    `edit_program_20331`,
    `edit_age_range_20332`,
    `edit_grade_20333`,
    `edit_class_20334`,
    `move_students_to_another_class_20335`,
    `edit_subjects_20337`,
    `delete_school_20440`,
    `delete_program_20441`,
    `delete_age_range_20442`,
    `delete_grade_20443`,
    `delete_class_20444`,
    `delete_student_from_class_roster_20445`,
    `delete_teacher_from_class_20446`,
    `delete_subjects_20447`,
    `roles_30100`,
    `view_roles_and_permissions_30110`,
    `view_role_permissions_30112`,
    `create_role_with_permissions_30222`,
    `edit_role_and_permissions_30332`,
    `delete_role_30440`,
    `view_user_page_40101`,
    `view_users_40110`,
    `view_my_school_users_40111`,
    `view_my_class_users_40112`,
    `create_users_40220`,
    `create_my_school_users_40221`,
    `edit_users_40330`,
    `edit_my_school_users_40331`,
    `delete_users_40440`,
    `delete_my_school_users_40441`,
    `upload_users_40880`,
    `send_invitation_40882`,
    `deactivate_user_40883`,
    `reactivate_user_40884`,
    `deactivate_my_school_user_40885`,
    `publish_featured_content_for_all_hub_79000`,
    `publish_featured_content_for_specific_orgs_79001`,
    `publish_featured_content_for_all_orgs_79002`,
    `view_academic_term_20116`,
    `create_academic_term_20228`,
    `edit_academic_term_20338`,
    `delete_academic_term_20448`,
] as const;

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

                const index = permissions.findIndex((permission: Permission) => permission.permission_id === permissionId);

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
                    const permissionDetailsIndex = group.permissionDetails.findIndex((item) => item.permissionId === uniquePermission.permission_id);

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

function isPermissionCondition (permissionOption: PermissionOption): permissionOption is PermissionCondition {
    return typeof permissionOption !== `string` && !Array.isArray(permissionOption);
}

function buildPermissionCondition (permissionOption: PermissionOption): PermissionCondition {
    if (isPermissionCondition(permissionOption)) {
        return permissionOption;
    }

    return {
        AND: Array.isArray(permissionOption) ? permissionOption : [ permissionOption ],
    };
}

const permissionsInOrganization = (data: GetOrganizationMembershipsPermissionsResponse | undefined) => {
    return new Set((data?.me?.membership?.roles ?? []).flatMap((role) => role.permissions.map((permission) => permission.permission_id as PermissionId)));
};

const hasRequiredPermissions = (actualPermissions: Set<PermissionId>, permissionOption: PermissionOption) => {
    const root = buildPermissionCondition(permissionOption);

    const hasPermission = (perm: PermissionId | PermissionCondition) => {
        if (typeof perm === `string`) {
            return actualPermissions.has(perm);
        }
        return traversePermissionCondition(perm);
    };

    const traversePermissionCondition = (node: PermissionCondition): boolean => {
        let result = true;
        if (node?.AND) {
            result &&= node.AND.every(hasPermission);
        }
        if (node?.OR) {
            result &&= node.OR.some(hasPermission);
        }
        return result;
    };

    return traversePermissionCondition(root);
};

export type UsePermissionResult = {
    hasPermission?: boolean;
    loading: boolean;
}

export function usePermission (permissionOption: PermissionOption, wait?: undefined): boolean;
export function usePermission (permissionOption: PermissionOption, wait: boolean): UsePermissionResult;
export function usePermission (permissionOption: PermissionOption, wait?: boolean | undefined): boolean | UsePermissionResult {
    const currentOrganizationMembership = useCurrentOrganizationMembership();
    const organizationId = currentOrganizationMembership?.organization?.id ?? ``;

    const { data, loading } = useGetOrganizationMembershipsPermissions({
        variables: {
            organizationId,
        },
        skip: !organizationId,
    });

    if (loading && wait) {
        return {
            loading,
        };
    }

    const actualPermissions = permissionsInOrganization(data);
    const hasPermission = hasRequiredPermissions(actualPermissions, permissionOption);

    if (!wait) return hasPermission;

    return {
        loading,
        hasPermission: !loading ? hasPermission : undefined,
    };
}
