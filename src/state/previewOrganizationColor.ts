import {
    atom,
    useState,
} from "@kl-engineering/frontend-state";

export const previewOrganizationColorState = atom<string | undefined>({
    key: `previewOrganizationColor`,
    default: undefined,
});
export const usePreviewOrganizationColor = () => useState(previewOrganizationColorState);
