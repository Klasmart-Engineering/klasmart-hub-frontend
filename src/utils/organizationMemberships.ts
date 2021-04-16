import { OrganizationMembership } from "@/types/graphQL";
import { SetterOrUpdater } from "recoil";

export const buildEmptyOrganizationMembership = (): OrganizationMembership => ({
    organization_id: ``,
    user_id: ``,
});

export const selectOrganizationMembership = (membership: OrganizationMembership, organizationMembershipStack: OrganizationMembership[], setOrganizationMembershipStack: SetterOrUpdater<OrganizationMembership[]>) => {
    const otherOrganizations = organizationMembershipStack.filter((m) => m.organization_id !== membership.organization_id);
    setOrganizationMembershipStack([ membership, ...otherOrganizations ]);
};

export const removeOrganizationMembership = (membership: OrganizationMembership, organizationMembershipStack: OrganizationMembership[], setOrganizationMembershipStack: SetterOrUpdater<OrganizationMembership[]>) => {
    setOrganizationMembershipStack(organizationMembershipStack.filter((m) => m.organization_id !== membership.organization_id));
};
