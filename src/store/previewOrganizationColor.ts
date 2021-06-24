import {
    atom,
    useRecoilState,
} from "recoil";

export const previewOrganizationColorState = atom<string | undefined>({
    key: `previewOrganizationColor`,
    default: undefined,
});
export const usePreviewOrganizationColor = () => useRecoilState(previewOrganizationColorState);
