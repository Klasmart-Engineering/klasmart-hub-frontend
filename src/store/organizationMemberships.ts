import { OrganizationMembership } from "@/types/graphQL";
import {
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from "recoil";
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const organizationMembershipStackState = atom<OrganizationMembership[]>({
    key: `organizationStackState`,
    default: [],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    effects_UNSTABLE: [ persistAtom ],
});
export const useOrganizationStack = () => useRecoilState(organizationMembershipStackState);

export const currentOrganizationMembershipValue = selector({
    key: `currentOrganizationMembershipValue`,
    get: ({ get }) => {
        const memberships = get(organizationMembershipStackState);
        if (!memberships.length) return;
        return memberships[0];
    },
});
export const useCurrentOrganizationMembership = () => useRecoilValue(currentOrganizationMembershipValue);

export const currentOrganizationValue = selector({
    key: `currentOrganizationValue`,
    get: ({ get }) => {
        const memberships = get(organizationMembershipStackState);
        return memberships[0]?.organization;
    },
});
export const useCurrentOrganization = () => useRecoilValue(currentOrganizationValue);
