import {
    atom,
    useGlobalState,
} from "@kl-engineering/frontend-state";

export const previewOrganizationColorState = atom<string | undefined>({
    key: `previewOrganizationColor`,
    default: undefined,
});
export const usePreviewOrganizationColor = () => useGlobalState(previewOrganizationColorState);
