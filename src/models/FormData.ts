import { Role } from "./Role";
import { School } from "./UserSchool";

export interface FormData {
    given_name: string;
    family_name: string;
    email: string;
    roles: Role[];
    schools: School[];
    school_roles: Role[];
    avatar: string;
    user_id: string;
    birth_year_month: string;
    join_timestamp: string;
}
