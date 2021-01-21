export const orderedRoleNames = [
    `Super Admin`,
    `Organization Admin`,
    `School Admin`,
    `Teacher`,
    `Parent`,
    `Student`,
] as const;

export type RoleName = typeof orderedRoleNames[number];

export interface User {
    user_id: string;
    user_name?: string | null;
    given_name?: string | null;
    family_name?: string | null;
    email?: string | null;
    phone?: string | null;
    avatar?: string | null;
    membership?: OrganizationMembership | null;
    memberships?: OrganizationMembership[] | null;
    my_organization?: Organization | null;
    organization_ownerships?: OrganizationOwnership[];
}

export interface OrganizationOwnership {
    user_id: string;
    organization_id: string;
    status?: string | null;
    organization?: Organization | null;
    user?: User | null;
}

export interface OrganizationMembership {
    user_id: string;
    organization_id: string;
    user?: User | null;
    join_timestamp?: string | null;
    organization?: Organization | null;
    roles?: Role[] | null;
    checkAllowed?: boolean | null;
    status?: string | null;
    schoolMemberships?: SchoolMembership[] | null;
}

export interface Organization {
    organization_id: string;
    organization_name?: string | null;
    address1?: string | null;
    shortCode?: string | null;
    phone?: string | null;
    roles?: Role[] | null;
    students?: Student[] | null;
    owner?: User | null;
    classes?: Class[] | null;
    schools?: School[] | null;
    memberships?: OrganizationMembership[] | null;
}

export interface Role {
    role_id: string;
    role_name?: RoleName | null;
}

export interface Student {
    user_id: string;
    user?: User | null;
}

export interface Class {
    class_id: string;
    class_name?: string | null;
    schools?: School[] | null;
    status?: string | null;
}

export interface School {
    school_id: string;
    school_name?: string | null;
    status?: string | null;
}

export interface SchoolMembership {
    user_id: string;
    school_id: string;
    school?: School | null;
    roles?: Role[] | null;
}
