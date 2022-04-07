import { ClassUserRow } from "@/api/classRoster";
import { UserNode } from "@/api/users";
import { Role } from "@/types/graphQL";
import { RoleEdge } from "@/api/roles";

export enum UserGenders {
    MALE = `male`,
    FEMALE = `female`,
    NOT_SPECIFIED = `not-specified`,
    OTHER = `other`,
}

export const mapUserRolesToFilterValueOptions = (edges: RoleEdge[]) => (
    edges.map(edge => ({
        value: edge.node.id ?? ``,
        label: edge.node.name ?? ``,
    }))
);

export const mapUserRowPerRole = (edge: { node: UserNode }, role: string): ClassUserRow => ({
    givenName: edge.node.givenName ?? ``,
    familyName: edge.node.familyName ?? ``,
    role,
    tableId: `${edge.node.id}-${role}`,
    id: edge.node.id,
    organizationRoles: edge.node.roles?.map((role) => (
        role.name ?? ``
    )) ?? [],
    dateOfBirth: edge.node.dateOfBirth ?? null,
    contactInfo: edge.node.contactInfo?.email || edge.node.contactInfo?.phone || ``,
});
