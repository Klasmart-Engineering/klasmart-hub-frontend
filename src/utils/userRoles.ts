import { RoleName } from "@/types/graphQL";

export const getHighestRole = (rolePriority: readonly RoleName[], roles: (RoleName | null | undefined )[]) => {
    if (!roles.length) return null;
    const rolePriorityIndexes = roles.map((role) => !role ? Number.MAX_SAFE_INTEGER : rolePriority.indexOf(role));
    const highestPriorityRoleIndex = Math.min(...rolePriorityIndexes);
    return rolePriority[highestPriorityRoleIndex];
};
