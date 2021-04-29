import { Role } from "./Role";

export interface User {
    user_id: string;
    given_name: string;
    email?: string;
    role: string;
    class_name?: string;
    memberships?: Membership[];
}

export interface Membership {
    user: User;
    roles: Role[];
}

export interface Organization {
    organization_id: string;
    organization: {
        organization_name: string;
        organization_id: string;
    };
    memberships: Membership[];
}

export interface Data {
    organization: Organization;
}

export interface RootObject {
    data: Data;
}
