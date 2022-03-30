import { ReactNode } from "react";

export const mockEnqueueSnackbar = jest.fn();

jest.mock(`react-dom`, () => {
    const original = jest.requireActual(`react-dom`);
    return {
        ...original,
        createPortal: (node: ReactNode) => node,
    };
});

jest.mock(`@kl-engineering/kidsloop-px`, () => ({
    ...jest.requireActual(`@kl-engineering/kidsloop-px`),
    useSnackbar: () => ({
        enqueueSnackbar: mockEnqueueSnackbar,
    }),
    usePrompt: () => (() => Promise.resolve(true)),
    useConfirm: () => (() => Promise.resolve(true)),
}));
