import { useGetUser } from "@/api/users";
import {
    currentMembershipVar,
    userIdVar,
} from "@/cache";
import { orderedSystemRoleNames } from "@/types/graphQL";
import { useReactiveVar } from "@apollo/client";

export const roleNameTranslations: { [key: string]: string } = {
    'Super Admin': `users_superAdminRole`,
    'Organization Admin': `users_organizationAdminRole`,
    'School Admin': `users_schoolAdminRole`,
    Parent: `users_parentRole`,
    Student: `users_studentRole`,
    Teacher: `users_teacherRole`,
};

const orderedRoleNames = orderedSystemRoleNames.slice() as string[];

export const sortRoleNames = (a: string, b: string) => {
    const aIndex = orderedRoleNames.indexOf(a);
    const bIndex = orderedRoleNames.indexOf(b);
    if (aIndex === bIndex) return a.localeCompare(b);
    return aIndex - bIndex;
};

export const getHighestRole = (roles: string[]) => {
    if (!roles.length) return null;
    return roles.sort(sortRoleNames)[0];
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
