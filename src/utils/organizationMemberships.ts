import { mapRoles } from "./userRoles";
import { MyUserResponse } from "@/api/myUser";
import {
    OrganizationMembershipConnectionEdge,
    OrganizationMembershipConnectionNode,
} from "@/api/organizationMemberships";
import { OrganizationMembership } from "@/types/graphQL";
import { SetterOrUpdater } from "@kl-engineering/frontend-state";

export const buildEmptyOrganizationMembership = (): OrganizationMembership => ({
    organization_id: ``,
    user_id: ``,
});

export const mapOrganizationMembershipEdges = (edge: OrganizationMembershipConnectionEdge) => {
    const organizationMembership = edge.node;
    return {
        organization: organizationMembership.organization,
        joinTimestamp: organizationMembership.joinTimestamp,
        status: organizationMembership.status,
        roles: organizationMembership.rolesConnection?.edges.map(mapRoles),
    };
};

export const selectOrganizationMembership = (selectedMembership: OrganizationMembershipConnectionNode, organizationMembershipStack: OrganizationMembershipConnectionNode[], setOrganizationMembershipStack: SetterOrUpdater<OrganizationMembershipConnectionNode[]>) => {
    const otherOrganizations = organizationMembershipStack.filter((membership) => membership.organization?.id !== selectedMembership.organization?.id);
    setOrganizationMembershipStack([ selectedMembership, ...otherOrganizations ]);
};

export const removeOrganizationMembership = (membership: OrganizationMembershipConnectionNode, organizationMembershipStack: OrganizationMembershipConnectionNode[], setOrganizationMembershipStack: SetterOrUpdater<OrganizationMembershipConnectionNode[]>) => {
    setOrganizationMembershipStack(organizationMembershipStack.filter((membershipStack) => membershipStack.organization?.id !== membership.organization?.id));
};

export const getInitialOwnedOrg = (userData?: MyUserResponse): string | undefined => {
    if (!userData) return;

    const userId = userData.myUser.node.id;
    const orgs = userData.myUser.node.organizationMembershipsConnection?.edges ?? [];
    const owned = orgs.find(org => org?.node?.organization?.owners?.find(owner => owner.id === userId));

    return owned?.node?.organization?.id;
};
