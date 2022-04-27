import { useQueryMyUser } from "@/api/myUser";
import { RolesConnectionEdge } from "@/api/organizationMemberships";
import { RoleSummaryNode } from "@/api/roles";
import { 
    orderedSystemRoleNames, 
    Status, 
} from "@/types/graphQL";
import { useCurrentOrganization } from "@/store/organizationMemberships";
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

export const mapRoles = (edge: RolesConnectionEdge) => {
    const role = edge.node;
    return {
        id: role.id,
        name: role.name ?? ``,
        status: role.status ?? Status.INACTIVE,
    };
};

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
    const currentOrganization = useCurrentOrganization();
    const { data: myUserData } = useQueryMyUser();
    const roles = myUserData?.myUser?.node?.roles?.filter((role: RoleSummaryNode) => role.organizationId === currentOrganization?.id);
    return!!roles?.find((role) => role.name === `Super Admin`);
};

export const getCustomRoleName = (intl: IntlShape, roleName: string) => {
    const translatedRoleName = roleNameTranslations[roleName];
    if (!translatedRoleName) return roleName;
    return intl.formatMessage({
        id: translatedRoleName,
    });
};
