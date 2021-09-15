import { getElementError } from "@testing-library/react";
import { mockEnqueueSnackbar } from "@tests/mocks";

// To avoid resizing of the form control when an error is added/removed, if no error we use
// a space as the `helperText` in the PX `TextField`
// MaterialUI converts this to a Zero-width space, so need to assert that value instead
export const TEXT_FIELD_NO_ERROR = `\u200B`;

export function expectFormControlToHaveError ({ formControl, error }: { formControl: HTMLElement; error?: string | RegExp}) {
    expect(formControl.querySelector(`.MuiInputBase-root`)).toHaveClass(`Mui-error`);

    const helperText = formControl.querySelector(`.MuiFormHelperText-root`);
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass(`Mui-error`);
    if (error !== undefined) {
        expect(helperText).toHaveTextContent(error);
    }
}

export function expectFormControlNotToHaveError (formControl: HTMLElement) {
    expect(formControl.querySelector(`.MuiInputBase-root`)).not.toHaveClass(`Mui-error`);
    expect(formControl.querySelector(`.MuiFormHelperText-root`)?.textContent).toBe(TEXT_FIELD_NO_ERROR);
}

function expectSnackbar (message: string, variant: string) {
    expect(mockEnqueueSnackbar).toHaveBeenCalledTimes(1);
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(message, {
        variant,
    });
}

export function expectSnackbarError (message: string) {
    expectSnackbar(message, `error`);
}

export function expectSnackbarSuccess (message: string) {
    expectSnackbar(message, `success`);
}

export const isAccordion = (element: HTMLElement) => element.classList.contains(`MuiAccordion-root`);

export function expectAccordionExpanded (accordion: HTMLElement) {
    expect(accordion.firstChild).toHaveClass(`Mui-expanded`);
}

export function expectAccordionCollapsed (accordion: HTMLElement) {
    expect(accordion.firstChild).not.toHaveClass(`Mui-expanded`);
}

function findFormControlForInput (input: HTMLElement) {
    const formControl = input.closest(`.MuiFormControl-root`);
    if (formControl === null) {
        throw getElementError(`Could not find FormControl parent of input: ${input}`, document.body);
    }
    return formControl as HTMLElement;
}

export function expectInputToHaveError (input: HTMLElement, error?: string | RegExp) {
    return expectFormControlToHaveError({
        formControl: findFormControlForInput(input),
        error,
    });
}

export function expectInputNotToHaveError (input: HTMLElement) {
    return expectFormControlNotToHaveError(findFormControlForInput(input));
}
