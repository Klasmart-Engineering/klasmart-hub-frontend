import { Role } from "./Role";

export interface UserMembership {
    user: {
        avatar: string;
        email: string;
        phone: string;
        user_id: string;
        user_name: string;
        given_name: string;
        family_name: string;
    };
    user_id: string;
    roles: Role[];
    status: string;
}
