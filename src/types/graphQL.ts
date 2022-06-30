import { GradeNode } from "@/api/grades";
import { FilterValueOption } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Filter/Filters";
import {
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";

export const orderedSystemRoleNames = [
    `Super Admin`,
    `Organization Admin`,
    `School Admin`,
    `Teacher`,
    `Parent`,
    `Student`,
] as const;

export const NON_SPECIFIED = `None Specified`;

export enum Status {
    ACTIVE = `active`,
    INACTIVE = `inactive`,
}

export type Direction = `FORWARD` | `BACKWARD`;

export const sortOrders = [ `ASC`, `DESC` ] as const;

export type SortOrder = typeof sortOrders[number];

export type PaginationDirection = `FORWARD` | `BACKWARD`

export interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
}

export const isNonSpecified = (entity: BaseEntity) => {
    return entity?.name === NON_SPECIFIED && !!entity?.system;
};

export const isOtherSystemValue = (entity: BaseEntity) => {
    return entity?.name !== NON_SPECIFIED && !!entity?.system;
};

export const isSystemValue = (entity: BaseEntity) => {
    return !!entity?.system;
};

export const isCustomValue = (entity: BaseEntity) => {
    return !entity?.system;
};

export const isActive = (entity: BaseEntity) => {
    return entity?.status === Status.ACTIVE;
};

export const sortEntitiesByName = (a: BaseEntity, b: BaseEntity) => a.name?.localeCompare(b.name ?? ``) ?? 0;
export const sortEntitiesByLabel = (a: FilterValueOption, b: FilterValueOption) => a.label?.localeCompare(b.label ?? ``) ?? 0;

export const useHandleUpdateNonSpecified = (values: string[], setValues: Dispatch<SetStateAction<string[]>>, nonSpecifiedId?: string) => {
    if (!values.find((value) => nonSpecifiedId === value) || values.length <= 1) return;
    setValues((values) => {
        const isNonSpecified = values.find((value) => nonSpecifiedId === value);
        return isNonSpecified ? values.slice(1) : values.slice(values.length - 1, values.length);
    });
};

export interface BaseEntity {
    id?: string;
    name?: string | null;
    status?: Status | null;
    system?: boolean | null;
}

export interface PageBaseEntity {
    totalCount?: number;
    pageInfo?: PageInfo;
}

export interface User {
    user_id: string;
    username?: string | null;
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
    date_of_birth?: string | null;
    gender?: string | null;
    shortcode?: string | null;
    alternate_email?: string | null;
    alternate_phone?: string | null;
}

export interface OrganizationOwnership {
    user_id: string;
    organization_id: string;
    status?: Status | null;
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
    status?: Status | null;
    schoolMemberships?: SchoolMembership[] | null;
    shortcode?: string | null;
}

export interface SchoolMembership {
    user_id: string;
    school_id: string;
    join_timestamp?: string | null;
    status?: Status | null;
    user?: User | null;
    school?: SchoolDeprecated | null;
    roles?: Role[] | null;
}

export interface Organization {
    organization_id: string;
    organization_name: string;
    status?: Status | null;
    address1?: string | null;
    address2?: string | null;
    shortCode?: string | null;
    phone?: string | null;
    roles?: Role[] | null;
    students?: Student[] | null;
    primary_contact?: User | null;
    classes?: Class[] | null;
    schools?: SchoolDeprecated[] | null;
    memberships?: OrganizationMembership[] | null;
    createRole?: Role;
    ageRanges?: AgeRange[] | null;
    programs?: Program[] | null;
    subjects?: Subject[] | null;
    grades?: Grade[] | null;
    createClass?: Class | null;
    categories?: Category[] | null;
    subcategories?: Subcategory[] | null;
    branding?: Branding;
    setBranding?: {
        iconImage?: File | null;
        primaryColor?: string | null;
    };
}

export type OrganizationTab = `organizationInfo` | `personalization`

export interface Role {
    role_id: string;
    role_name: string;
    role_description?: string | null;
    system_role?: boolean | null;
    delete_role?: boolean | null;
    status?: Status | null;
    permissions: Permission[];
}

export interface Student {
    user_id: string;
    user?: User | null;
    given_name?: string | null;
    family_name?: string | null;
    membership?: OrganizationMembership | null;
}

export interface Teacher {
    user_id: string;
    user?: User | null;
    given_name?: string | null;
    family_name?: string | null;
    membership?: OrganizationMembership | null;
}

export interface Class {
    class_id: string;
    class_name?: string | null;
    schools?: SchoolDeprecated[] | null;
    age_ranges?: AgeRange[] | null;
    programs?: Program[] | null;
    subjects?: Subject[] | null;
    grades?: Grade[] | null;
    students?: Student[] | null;
    teachers?: Teacher[] | null;
    status?: Status | null;
    organization?: Organization[] | null;
    academicterm?: AcademicTerm | null;
}

export interface AcademicTerm {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
}

export interface SchoolDeprecated {
    school_id: string;
    school_name?: string | null;
    shortcode?: string | null;
    classes?: Class[] | null;
    programs?: Program[] | null;
    status?: Status | null;
    system?: boolean | null;
    memberships?: SchoolMembership[] | null;
}

export interface SchoolMembership {
    user_id: string;
    school_id: string;
    school?: SchoolDeprecated | null;
    roles?: Role[] | null;
    user?: User | null;
    status?: Status | null;
}

export interface Permission {
    permission_name: string;
    permission_id: string;
    permission_group: string;
    permission_level: string;
    permission_category: string;
    permission_description: string;
}

export interface AgeRange extends BaseEntity {
    high_value?: number | null;
    high_value_unit?: string | null;
    low_value?: number | null;
    low_value_unit?: string | null;
}

export interface Grade extends BaseEntity {
    progress_from_grade?: Grade | null;
    progress_to_grade?: Grade | null;
}

export interface Subject extends BaseEntity {
    subcategories?: Subcategory[] | null;
    categories?: Category[] | null;
}

export interface Program extends BaseEntity {
    age_ranges?: AgeRange[] | null;
    grades?: Grade[] | null;
    subjects?: Subject[] | null;
}

export interface ProgramsMutationResult {
    programs?: ProgramConnectionNode[];
}

export interface ProgramConnectionNode extends BaseEntity {
    subjectsConnection?: SubjectsConnectionResponse;
    gradesConnection?: GradesConnectionResponse;
    ageRangesConnection?: AgeRangesConnectionResponse;
}

export interface SubjectsConnectionResponse extends PageBaseEntity {
    edges?: SubjectsConnectionEdge[];
}

export interface GradesConnectionResponse extends PageBaseEntity {
    edges?: GradesConnectionEdge[];
}

export interface AgeRangesConnectionResponse extends PageBaseEntity {
    edges?: AgeRangesConnectionEdge[];
}

export interface SubjectsConnectionEdge {
    cursor?: string;
    node?: SubjectConnectionNode;
}

export interface GradesConnectionEdge {
    cursor?: string;
    node?: GradeConnectionNode;
}

export interface AgeRangesConnectionEdge {
    cursor?: string;
    node?: AgeRangeConnectionNode;
}

export interface SubjectConnectionNode extends BaseEntity {
    categoriesConnection?: CategoriesConnectionResponse;
}

export interface GradeConnectionNode extends GradeNode {

}

export interface AgeRangeConnectionNode {
    id: string;
    name: string;
    status?: Status;
    system?: boolean;
    lowValue?: number;
    lowValueUnit?: AgeRangeUnit;
    highValue?: number;
    highValueUnit?: AgeRangeUnit;
}

export interface CategoriesConnectionResponse extends PageBaseEntity {
    edges?: CategoriesConnectionEdge[];
}

export interface CategoriesConnectionEdge {
    cursor?: string;
    node?: CategoryConnectionNode;
}

export interface CategoryConnectionNode extends BaseEntity {
    subjectsConnection?: SubjectsConnectionResponse;
    subcategoriesConnection?: SubcategoriesConnectionResponse;
}

export interface SubcategoriesConnectionResponse extends PageBaseEntity {
    edges?: SubcategoriesConnectionEdge[];
}

export interface SubcategoriesConnectionEdge {
    cursor?: string;
    node?: SubcategoryConnectionNode;
}

export interface SubcategoryConnectionNode extends BaseEntity {

}

export interface Category extends BaseEntity {
    subcategories?: Subcategory[] | null;
}

export type Subcategory = BaseEntity

export interface SchoolsMutationResult {
   schools: SchoolConnectionNode[];
}

export interface SchoolConnectionNode {
    id: string;
    name: string;
}
export interface Branding {
    iconImageURL: string | null;
    primaryColor: string | null;
}

export type UuidOperator = `eq` | `neq`;

export type UuidExclusiveOperator = `eq` | `neq` | `isNull`;

export type StringOperator = `eq` | `neq` | `contains`;

export type BooleanOperator = `eq`;

export type NumberOperator = `eq` | `neq` | `gt` | `gte` | `lt` | `lte`;

export type AgeRangeUnit = `year` | `month`;

export interface AgeRangeValue {
    value: number;
    unit: AgeRangeUnit;
}

export interface UuidFilter {
    operator: UuidOperator;
    value: string;
}

export interface UuidExclusiveFilter {
    operator: UuidExclusiveOperator;
    value?: string;
}

export interface StringFilter {
    operator: StringOperator;
    value: string;
    caseInsensitive?: boolean;
}

export interface BooleanFilter {
    operator: BooleanOperator;
    value: boolean;
}

export interface StatusFilter {
    operator: BooleanOperator;
    value: Status;
}

export interface DateFilter {
    operator: NumberOperator;
    value: string;
}

export interface NumberFilter {
    operator: NumberOperator;
    value: number;
}

export interface AgeRangeFilter {
    operator: NumberOperator;
    value: number | AgeRangeUnit;
}
