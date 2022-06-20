import {
    atom,
    statePersist,
} from "@kl-engineering/frontend-state";

const { persistAtom } = statePersist();

export const sideNavigationDrawerOpenState = atom({
    key: `sideNavigationDrawerOpen`,
    default: false,
});

export const isSideNavigationDrawerMiniVariantState = atom<boolean>({
    key: `sideNavigationDrawerMiniVariant`,
    default: false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    effects_UNSTABLE: [ persistAtom ],
});
