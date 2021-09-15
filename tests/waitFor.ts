import { waitForElementToBeRemoved } from "@testing-library/react";

export async function waitForButtonToLoad (button: HTMLElement) {
    const loadingContainer = button.querySelector(`.MuiCircularProgress-root`);

    if (loadingContainer === null) {
        console.warn(`Unable to find a loading container for this button`);
        return;
    }

    return waitForElementToBeRemoved(loadingContainer);
}
