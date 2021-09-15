import {
    Role,
    Status,
} from "@/types/graphQL";

type MockRoleName = `organizationAdmin` | `schoolAdmin` | `customRole` | `inactiveRole` | `parent` | `student` | `teacher`

export const mockRoles: {
    [key in MockRoleName]: Role;
} = {
    organizationAdmin:     {
        role_id: `32d320c8-055a-457a-853a-00f8ab04b074`,
        role_name: `Organization Admin`,
        role_description: `System Default Role`,
        system_role: true,
        status: Status.ACTIVE,
        permissions: [],
    },
    schoolAdmin: {
        role_id: `85e1daad-b56a-470b-a69f-a237d6dd4f0a`,
        role_name: `School Admin`,
        role_description: `System Default Role`,
        system_role: true,
        status: Status.ACTIVE,
        permissions: [],
    },
    customRole: {
        role_id: `f1be9243-dd8b-4352-86b0-3f4c8a0ceab6`,
        role_name: `Custom Role`,
        role_description: `Custom role unique to this organization`,
        system_role: false,
        status: Status.ACTIVE,
        permissions: [],
    },
    inactiveRole: {
        role_id: `4b01b2e8-eb3b-4ffa-986e-6164b87299f3`,
        role_name: `Inactive Role`,
        role_description: `Role which has been inactivated`,
        system_role: false,
        status: Status.INACTIVE,
        permissions: [],
    },
    parent: {
        role_id: `7efae37c-d2c1-470d-8b82-733ca465a3d8`,
        role_name: `Parent`,
        role_description: `System Default Role`,
        system_role: true,
        status: Status.ACTIVE,
        permissions: [],
    },
    student: {
        role_id: `c3193eb4-5dba-4779-a3fc-0297a412bbed`,
        role_name: `Student`,
        role_description: `System Default Role`,
        system_role: true,
        status: Status.ACTIVE,
        permissions: [],
    },
    teacher: {
        role_id: `2d724148-6d0d-4813-9ad7-a2e9ee4407ad`,
        role_name: `Teacher`,
        role_description: `System Default Role`,
        system_role: true,
        status: Status.ACTIVE,
        permissions: [],
    },
};

export const mockSystemRoles = [
    mockRoles.organizationAdmin,
    mockRoles.schoolAdmin,
    mockRoles.parent,
    mockRoles.student,
    mockRoles.teacher,
];
