import {
    fireEvent,
    getElementError,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    getByDataValue,
    getPopover,
} from "@tests/queries";

const closePopover = () => fireEvent.keyDown(document.activeElement, {
    key: `Esc`,
});

export async function selectAccordionOptions (accordion: HTMLElement, values: string[]) {
    userEvent.click(accordion);

    const popover = getPopover();

    values.forEach(value => {
        const option = getByDataValue(popover,  value);
        userEvent.click(option);
    });

    closePopover();

    await waitForElementToBeRemoved(popover);
}

export function toggleAccordion (accordion: HTMLElement) {
    const accordionSummary = accordion.querySelector(`.MuiAccordionSummary-root`);
    if (accordionSummary === null) {
        throw getElementError(`Unable to find child AccordionSummary of Accordion ${accordion}`, accordion);
    }
    userEvent.click(accordionSummary);
}

export async function deselectAll (accordion: HTMLElement) {
    userEvent.click(accordion);

    const popover = getPopover();

    popover.querySelectorAll(`input:checked`).forEach(input => {
        if (input.closest(`li`)?.dataset?.value) {
            // Avoid clicking `Select All` if present
            userEvent.click(input);
        }
    });

    closePopover();
    await waitForElementToBeRemoved(popover);
}
