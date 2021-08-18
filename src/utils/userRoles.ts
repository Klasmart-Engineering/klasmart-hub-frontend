import { useGetOrganizationRoles } from "@/api/roles";
import { useGetUser } from "@/api/users";
import { userIdVar } from "@/cache";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    orderedSystemRoleNames,
    Role,
} from "@/types/graphQL";
import { useReactiveVar } from "@apollo/client";
import { FilterValueOption } from "kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import {
    useEffect,
    useState,
} from "react";
import { IntlShape } from "react-intl";

export const roleNameTranslations: { [key: string]: string } = {
    'Super Admin': `users_superAdminRole`,
    'Organization Admin': `users_organizationAdminRole`,
    'School Admin': `users_schoolAdminRole`,
    Parent: `users_parentRole`,
    Student: `users_studentRole`,
    Teacher: `users_teacherRole`,
};

export const systemRoles = [
    `Organization Admin`,
    `School Admin`,
    `Parent`,
    `Student`,
    `Teacher`,
];

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
    const currentOrganization = useCurrentOrganization();
    const selectedMembershipOrganization = userData?.user?.memberships?.find((membership) => membership.organization_id === currentOrganization?.organization_id);
    return!!selectedMembershipOrganization?.roles?.find((role) => role.role_name === `Super Admin`);
};

export const getCustomRoleName = (intl: IntlShape, roleName: string) => {
    const translatedRoleName = roleNameTranslations[roleName];
    if (!translatedRoleName) return roleName;
    return intl.formatMessage({
        id: translatedRoleName,
    });
};
