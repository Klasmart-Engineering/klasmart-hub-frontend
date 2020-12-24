import { Role } from "./Role";
import { School } from "./UserSchool";

export interface FormData {
    given_name: string;
    family_name: string;
    contactInfo?: string;
    phone?:string
    email?: string
    roles: Role[];
    schools: School[];
    school_roles: Role[];
    avatar: string;
    user_id: string;
}
