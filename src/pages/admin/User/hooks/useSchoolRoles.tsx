import { useState } from "react";
import { Role } from "../../../../models/Role";

export const useSchoolRoles = () => {
    const [schoolRoles, setSchoolRoles] = useState<Role[]>([]);

    return { schoolRoles, setSchoolRoles };
};
