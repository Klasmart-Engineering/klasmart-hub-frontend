export interface User {
    user_id: string
    email?: string | null
}

export interface Membership {
    user_id: string
    organization_id: string
    join_timestamp?: string | null
    organization?: Organization | null
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
    role_name?: string | null
}

export interface Student {
    user_id: string
    user?: User | null
}
