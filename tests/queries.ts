import {
    buildQueries,
    getByLabelText,
    getElementError,
    Matcher,
    MatcherOptions,
    queryHelpers,
    screen,
} from "@testing-library/react";

type QueryAllByDataValue = (
    container: HTMLElement,
    id: Matcher,
    options?: MatcherOptions,
) => HTMLElement[]

const queryAllByDataValue: QueryAllByDataValue = queryHelpers.queryAllByAttribute.bind(null, `data-value`);

const getMultipleDataValueError = (c: HTMLElement, dataValue: Matcher) => `Found multiple elements with the data-value attribute of: ${dataValue}`;

const getMissingDataValueError = (c: HTMLElement, dataValue: Matcher) => `Unable to find an element with the data-value attribute of: ${dataValue}`;

const [
    queryByDataValue,
    getAllByDataValue,
    getByDataValue,
    findAllByDataValue,
    findByDataValue,
] = buildQueries(queryAllByDataValue, getMultipleDataValueError, getMissingDataValueError);

export {
    findAllByDataValue,
    findByDataValue,
    getAllByDataValue,
    getByDataValue,
    queryAllByDataValue,
    queryByDataValue,
};

export function getFormControl ({ container, label }: {container?: HTMLElement; label: string}) {
    if (container === undefined) {
        container = document.body;
    }
    const input = getByLabelText(container, label);
    const formControl = input.closest(`.MuiFormControl-root`);
    if (formControl === null) {
        throw getElementError(`Unable to find FormControl parent for input with label of: ${label}`, container);
    }
    return formControl as HTMLElement;
}

export function getBackdrop () {
    const backdrop = document.body.querySelector(`.MuiBackdrop-root`);

    if (backdrop === null) {
        throw getElementError(`Unable to find a backdrop element (.MuiBackdrop-root) to remove focus from popover`, document.body);
    }

    return backdrop;
}

export function getPopover () {
    const optionContainer = document.body.querySelector(`.MuiPopover-root`);

    if (optionContainer === null) {
        throw getElementError(`Unable to find a popover element with options (.MuiPopover-root)`, document.body);
    }
    return optionContainer as HTMLElement;
}

export function getAccordionByLabelText (label:string) {
    const accordionSummary = screen.getByLabelText(label);
    const accordion = accordionSummary.closest(`.MuiAccordion-root`);
    if (accordion === null) {
        throw getElementError(`Could not find parent Accordion of AccordionSummary with label: ${label}`, document.body);
    }
    return accordion as HTMLElement;
}
