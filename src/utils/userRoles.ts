import { RoleName } from "@/types/graphQL";

export const getHighestRole = (rolePriority: readonly RoleName[], roles: RoleName[]) => {
    if (!roles.length) return null;
    const rolePriorityIndexes = roles.map((role) => rolePriority.indexOf(role));
    const highestPriorityRoleIndex = Math.min(...rolePriorityIndexes);
    return rolePriority[highestPriorityRoleIndex];
};
