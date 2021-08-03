import { render } from "@testing-library/react";
import {
    createMemoryHistory,
    MemoryHistory,
} from "history";
import React,
{ ReactNode } from "react";
import { Router } from "react-router-dom";

export interface RenderWithRouterOptions {
    route?: string;
    history?: MemoryHistory;
}

export function renderWithRouter (ui: ReactNode,
    {
        route = `/`,
        history = createMemoryHistory({
            initialEntries: [ route ],
        }),
    }: RenderWithRouterOptions = {}) {
    return {
        ...render(<Router history={history}>{ui}</Router>),
        history,
    };
}
