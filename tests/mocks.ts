import { ReactNode } from "react";

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
        enqueueSnackbar: jest.fn(),
    }),
    usePrompt: () => (async () => true),
    useConfirm: () => (async () => true),
}));