const roleNames = [
    "Organization Admin",
    "School Admin",
    "Parent",
    "Teacher",
    "Student",
] as const;

export type RoleName = typeof roleNames[number];

export interface User {
    user_id: string;
    user_name?: string | null;
    email?: string | null;
    phone?: string | null;
    avatar?: string | null;
    membership?: Membership | null;
    memberships?: Membership[] | null;
    my_organization?: Organization | null;
    organization_ownerships?: OrganizationOwnership[];
}

export interface OrganizationOwnership {
    status: string;
    organization: Organization;
    user: User;
}

export interface Membership {
    user_id: string;
    organization_id: string;
    join_timestamp?: string | null;
    organization?: Organization | null;
    roles?: Role[] | null;
    checkAllowed?: boolean | null;
    status: string;
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
