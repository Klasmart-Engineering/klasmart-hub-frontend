import { OrganizationMembershipConnectionNode } from "@/api/organizationMemberships";
import { OrganizationMembership } from "@/types/graphQL";
import { SetterOrUpdater } from "recoil";

export const buildEmptyOrganizationMembership = (): OrganizationMembership => ({
    organization_id: ``,
    user_id: ``,
});

export const selectOrganizationMembership = (selectedMembership: OrganizationMembershipConnectionNode, organizationMembershipStack: OrganizationMembershipConnectionNode[], setOrganizationMembershipStack: SetterOrUpdater<OrganizationMembershipConnectionNode[]>) => {
    const otherOrganizations = organizationMembershipStack.filter((membership) => membership.organization?.id !== selectedMembership.organization?.id);
    setOrganizationMembershipStack([ selectedMembership, ...otherOrganizations ]);
};

export const removeOrganizationMembership = (membership: OrganizationMembershipConnectionNode, organizationMembershipStack: OrganizationMembershipConnectionNode[], setOrganizationMembershipStack: SetterOrUpdater<OrganizationMembershipConnectionNode[]>) => {
    setOrganizationMembershipStack(organizationMembershipStack.filter((membershipStack) => membershipStack.organization?.id !== membership.organization?.id));
};
