export const orderedSystemRoleNames = [
    `Super Admin`,
    `Organization Admin`,
    `School Admin`,
    `Teacher`,
    `Parent`,
    `Student`,
] as const;

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
    full_name?: string | null;
    role?: string | null;
    address?: string | null;
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
    status?: string | null;
    address1?: string | null;
    shortCode?: string | null;
    phone?: string | null;
    roles?: Role[] | null;
    students?: Student[] | null;
    owner?: User | null;
    classes?: Class[] | null;
    schools?: School[] | null;
    memberships?: OrganizationMembership[] | null;
    createRole?: Role;
    ageRanges?: AgeRange[] | null;
    programs?: Program[] | null;
    subjects?: Subject[] | null;
    grades?: Grade[] | null;
    createClass?: Class | null;
}

export interface Role {
    role_id: string;
    role_name?: string | null;
    role_description?: string | null;
    system_role?: boolean | null;
    delete_role?: boolean | null;
    status?: string | null;
    permissions: Permission[];
}

export interface Student {
    user_id: string;
    user?: User | null;
    given_name?: string | null;
}

export interface Teacher {
    user_id: string;
    user?: User | null;
    given_name?: string | null;
}

export interface Class {
    class_id: string;
    class_name?: string | null;
    schools?: School[] | null;
    status?: string | null;
    age_ranges?: AgeRange[] | null;
    programs?: Program[] | null;
    subjects?: Subject[] | null;
    grades?: Grade[] | null;
    students?: Student[] | null;
    teachers?: Teacher[] | null;
}

export interface School {
    school_id: string;
    school_name?: string | null;
    shortcode?: string | null;
    status?: string | null;
    classes?: Class[] | null;
    programs?: Program[] | null;
    memberships?: SchoolMembership[] | null;
}

export interface SchoolMembership {
    user_id: string;
    school_id: string;
    school?: School | null;
    roles?: Role[] | null;
    user?: User | null;
    status?: string | null;
}

export interface Permission {
    permission_name: string;
    permission_id: string;
    permission_group: string;
    permission_level: string;
    permission_category: string;
    permission_description: string;
}

export interface AgeRange {
    id: string;
    from?: number | null;
    fromUnit?: string | null;
    to?: number | null;
    toUnit?: string | null;
    name?: string | null;
    high_value?: number | null;
    high_value_unit?: string | null;
    low_value?: number | null;
    low_value_unit?: string | null;
    system?: boolean;
    status?: string;
}

export interface Grade {
    id?: string;
    name?: string | null;
    progress_from_grade?: Grade | null;
    progress_to_grade?: Grade | null;
    progress_from_grade_id?: string | null;
    progress_to_grade_id?: string | null;
    system?: boolean | null;
    status?: string | null;
}

export interface Subject {
    id: string;
    name?: string | null;
    categories?: Category[] | null;
    subcategories?: Subcategory[] | null;
    system?: boolean | null;
    status?: string | null;
}

export interface Program {
    id: string;
    name?: string | null;
    age_ranges?: AgeRange[] | null;
    grades?: Grade[] | null;
    subjects?: Subject[] | null;
}

export interface Category {
    id: string;
    name?: string | null;
    subcategories?: Subcategory[] | null;
    system?: boolean | null;
    status?: string | null;
}

export interface Subcategory {
    id: string;
    name?: string | null;
    system?: boolean | null;
    status?: string | null;
}
