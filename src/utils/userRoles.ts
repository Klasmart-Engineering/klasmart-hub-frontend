import { Role, RoleName } from "../types/graphQL";

export const getHighestRole = (roles?: Role[] | null) => {
    if (!roles?.length) return null;
    const rolePriority: RoleName[] = ["Organization Admin", "School Admin", "Parent", "Teacher", "Student"];
    const foundPriorityIndexes = roles
        .map(function (role) {
            const roleName = role.role_name as RoleName;
            return rolePriority.indexOf(roleName);
        })
        .filter((priority) => priority !== -1);
    if (!foundPriorityIndexes.length) return null;
    const highestPriorityIndex = Math.min(...foundPriorityIndexes);
    return rolePriority[highestPriorityIndex];
};