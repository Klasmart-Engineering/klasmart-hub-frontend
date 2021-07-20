import { SchoolNode } from "@/api/schools";
import { SchoolRow } from "@/components/School/Table";
import { School } from "@/types/graphQL";

export const buildEmptySchool = (school?: School): School => ({
    school_id: school?.school_id ?? ``,
    school_name: school?.school_name ?? ``,
    classes: school?.classes ?? [],
    memberships: school?.memberships,
    programs: school?.programs,
    shortcode: school?.shortcode,
    status: school?.status,
});

export const mapSchoolNodeToSchool = (node: SchoolNode): School => ({
    school_id: node.id,
    school_name: node.name,
    status: node.status,
    shortcode: node.shortCode,
});

export const mapSchoolNodeToSchoolRow = (node: SchoolNode): SchoolRow => ({
    id: node.id,
    name: node.name,
    status: node.status,
    shortCode: node.shortCode,
});

export const sortSchoolNames = (a: string, b: string, locale?: string, collatorOptions?: Intl.CollatorOptions) => a.localeCompare(b, locale, collatorOptions);
