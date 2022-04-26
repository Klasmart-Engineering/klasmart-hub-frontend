import { SchoolsMembershipConnectionEdge } from "@/api/organizationMemberships";
import {
    SchoolEdge,
    SchoolNode,
} from "@/api/schools";
import { SchoolStepper } from "@/components/School/Dialog/Steps/shared";
import { SchoolRow } from "@/components/School/Table";
import {
    SchoolDeprecated,
    Status,
} from "@/types/graphQL";

export const buildEmptySchool = (school?: SchoolDeprecated): SchoolDeprecated => ({
    school_id: school?.school_id ?? ``,
    school_name: school?.school_name ?? ``,
    classes: school?.classes ?? [],
    memberships: school?.memberships,
    programs: school?.programs,
    shortcode: school?.shortcode,
    status: school?.status,
});

export const buildEmptySchoolNode = (): SchoolStepper => ({
    id: ``,
    name: ``,
    status: Status.ACTIVE,
    shortcode: ``,
    programIds: [],
});

export const mapSchoolNodeToSchoolStepper = (node: SchoolNode, programIds?: string[]): SchoolStepper => ({
    id: node?.id ?? ``,
    name: node?.name ?? ``,
    status: node?.status ?? Status.ACTIVE,
    shortcode: node?.shortCode ?? ``,
    programIds: programIds ?? [],
});

export const mapSchoolNodeToSchoolRow = (node: SchoolNode): SchoolRow => ({
    id: node.id,
    name: node.name,
    status: node.status,
    shortCode: node.shortCode,
});

export const mapSchoolsMembershipEdges = (edge: SchoolsMembershipConnectionEdge) => {
    const schoolMembership = edge.node.school;

    return {
        id: schoolMembership.id,
        name: schoolMembership.name,
        organizationId: schoolMembership.organizationId,
        status: schoolMembership.status,
    };
};

export const sortSchoolNames = (a: string, b: string, locale?: string, collatorOptions?: Intl.CollatorOptions) => a.localeCompare(b, locale, collatorOptions);

export const mapSchoolEdgesToFilterValues = (schoolEdges: SchoolEdge[]) => (
    schoolEdges.filter((edge) => edge.node.status === Status.ACTIVE).map((edge) => ({
        label: edge.node.name,
        value: edge.node.id,
    }))
);
