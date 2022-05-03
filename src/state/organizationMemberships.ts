import { OrganizationMembershipConnectionNode } from "@/api/organizationMemberships";
import {
    atom,
    selector,
    statePersist,
    useState,
    useStateValue,
} from "@kl-engineering/frontend-state";

const { persistAtom } = statePersist();

export const organizationMembershipStackState = atom<OrganizationMembershipConnectionNode[]>({
    key: `organizationStackState`,
    default: [],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    effects_UNSTABLE: [ persistAtom ],
});
export const useOrganizationStack = () => useState(organizationMembershipStackState);

export const currentOrganizationMembershipValue = selector({
    key: `currentOrganizationMembershipValue`,
    get: ({ get }) => {
        const memberships = get(organizationMembershipStackState);
        if (!memberships.length) return;
        return memberships[0];
    },
});
export const useCurrentOrganizationMembership = () => useStateValue(currentOrganizationMembershipValue);

export const currentOrganizationValue = selector({
    key: `currentOrganizationValue`,
    get: ({ get }) => {
        const memberships = get(organizationMembershipStackState);
        return memberships[0]?.organization;
    },
});
export const useCurrentOrganization = () => useStateValue(currentOrganizationValue);
