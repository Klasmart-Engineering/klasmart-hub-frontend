const roleNames = ["Organization Admin", "School Admin", "Parent", "Teacher", "Student"] as const;

export type RoleName = typeof roleNames[number];

export interface User {
    user_id: string
    user_name?: string | null
    email?: string | null
    avatar?: string | null
    memberships?: Membership[] | null,
    my_organization?: Organization | null,
}

export interface Membership {
    user_id: string
    organization_id: string
    join_timestamp?: string | null
    organization?: Organization | null
    roles?: Role[] | null
}

export interface Organization {
    organization_id: string
    organization_name?: string | null
    address1?: string | null
    shortCode?: string | null
    phone?: string | null
    roles?: Role[] | null
    students?: Student[] | null
    owner?: User | null
}

export interface Role {
    role_id: string
    role_name?: RoleName | null
}

export interface Student {
    user_id: string
    user?: User | null
}