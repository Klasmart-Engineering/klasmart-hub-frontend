import { render } from "@testing-library/react";
import {
    createMemoryHistory,
    MemoryHistory,
} from "history";
import { ReactNode } from "react";
import {
    BrowserRouter,
    Router,
} from "react-router-dom";

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
        ...render((
            <Router
                location={history.location}
                navigator={history}
            >
                {ui}
            </Router>
        )),
        history,
    };
}
