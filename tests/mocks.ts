import { ReactNode } from "react";

export const mockEnqueueSnackbar = jest.fn();

jest.mock(`react-dom`, () => {
    const original = jest.requireActual(`react-dom`);
    return {
        ...original,
        createPortal: (node: ReactNode) => node,
    };
});

jest.mock(`kidsloop-px`, () => ({
    ...jest.requireActual(`kidsloop-px`),
    useSnackbar: () => ({
        enqueueSnackbar: mockEnqueueSnackbar,
    }),
    usePrompt: () => (async () => true),
    useConfirm: () => (async () => true),
}));
