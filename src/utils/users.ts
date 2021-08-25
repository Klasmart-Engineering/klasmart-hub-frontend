import { Role } from "@/types/graphQL";

export enum UserGenders {
    MALE = `male`,
    FEMALE = `female`,
    NOT_SPECIFIED = `not_specified`,
    OTHER = `other`,
}

export const mapUserRolesToFilterValueOptions = (roles: Role[]) => (
    roles.map(role => ({
        value: role.role_id ?? ``,
        label: role.role_name ?? ``,
    }))
);
