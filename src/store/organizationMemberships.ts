import {
    currentOrganizationMembershipState,
    currentOrganizationState,
    organizationMembershipStackState,
    useGlobalState,
    useGlobalStateValue,
} from "@kl-engineering/frontend-state";

export const useOrganizationStack = () => useGlobalState(organizationMembershipStackState);

export const useCurrentOrganizationMembership = () => useGlobalStateValue(currentOrganizationMembershipState);

export const useCurrentOrganization = () => useGlobalStateValue(currentOrganizationState);
