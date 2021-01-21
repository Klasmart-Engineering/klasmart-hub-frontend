import { useGetUser } from "@/api/users";
import {
    currentMembershipVar,
    userIdVar,
} from "@/cache";
import { RoleName } from "@/types/graphQL";
import { useReactiveVar } from "@apollo/client";

export const getHighestRole = (rolePriority: readonly RoleName[], roles: (RoleName | null | undefined )[]) => {
    if (!roles.length) return null;
    const rolePriorityIndexes = roles.map((role) => !role ? Number.MAX_SAFE_INTEGER : rolePriority.indexOf(role));
    const highestPriorityRoleIndex = Math.min(...rolePriorityIndexes);
    return rolePriority[highestPriorityRoleIndex];
};

export const useIsSuperAdmin = () => {
    const userId = useReactiveVar(userIdVar);
    const { data: userData } = useGetUser({
        variables: {
            user_id: userId,
        },
    });
    const selectedOrganizationMeta = useReactiveVar(currentMembershipVar);
    const selectedMembershipOrganization = userData?.user?.memberships?.find((membership) => membership.organization_id === selectedOrganizationMeta.organization_id);
    return!!selectedMembershipOrganization?.roles?.find((role) => role.role_name === `Super Admin`);
};
