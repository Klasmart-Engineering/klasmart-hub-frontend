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

export const sortSchoolNames = (a: string, b: string, locale?: string, collatorOptions?: Intl.CollatorOptions) => a.localeCompare(b, locale, collatorOptions);
