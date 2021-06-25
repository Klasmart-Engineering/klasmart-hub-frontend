import "@babel/polyfill";
import "node-source-han-sans-sc/SourceHanSansSC-Regular-all.css";
import "typeface-nanum-square-round";
import App from "./app";
import { cache } from "./cache";
import { getAPIEndpoint } from "./config";
import {
    createDefaultStore,
    State,
} from "./store/store";
import { themeProvider } from "./themeProvider";
import { redirectIfUnauthorized } from "./utils/accountUtils";
import { history } from "./utils/history";
import { getLanguage } from "./utils/locale";
import {
    ApolloClient,
    ApolloLink,
} from "@apollo/client/core";
import { ApolloProvider } from "@apollo/client/react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { createUploadLink } from "apollo-upload-client";
import {
    AlertDialogProvider,
    ConfirmDialogProvider,
    PromptDialogProvider,
    SnackbarProvider,
    utils,
} from "kidsloop-px";
import LogRocket from "logrocket";
import React,
{ useMemo } from "react";
import { useCookies } from "react-cookie";
import * as ReactDOM from "react-dom";
import { RawIntlProvider } from "react-intl";
import {
    Provider,
    useSelector,
} from "react-redux";
import { Router } from "react-router-dom";
import { RecoilRoot } from 'recoil';
import { PersistGate } from "redux-persist/integration/react";

LogRocket.init(`8qowji/badanamu-learning-pass`);

const objectCleanerLink = new ApolloLink((operation, forward) => {
    operation.variables = utils.trimStrings(operation.variables); // clean request data
    return forward(operation).map((value) => utils.trimStrings(value)); // clean response data
});

const uploadLink = createUploadLink({
    credentials: `include`,
    uri: `${getAPIEndpoint()}user/`,
});

export const client = new ApolloClient({
    credentials: `include`,
    link: ApolloLink.from([ objectCleanerLink, uploadLink ]),
    cache,
});

function ClientSide () {
    const memos = useMemo(() => {
        const url = new URL(window.location.href);
        const locale = url.searchParams.get(`iso`);
        return {
            hostName: url.hostname,
            locale,
        };
    }, []);

    const testing = memos.hostName === `localhost`;

    const [ cookies ] = useCookies([ `locale` ]);
    const languageCode = memos.locale ?? cookies.locale ?? useSelector((state: State) => state.ui.locale || `en`);
    const locale = getLanguage(languageCode);

    return (
        <ApolloProvider client={client}>
            <RawIntlProvider value={locale}>
                <ThemeProvider theme={themeProvider()}>
                    <ConfirmDialogProvider>
                        <PromptDialogProvider>
                            <AlertDialogProvider>
                                <SnackbarProvider closeButtonLabel="Dismiss">
                                    <CssBaseline />
                                    <App />
                                </SnackbarProvider>
                            </AlertDialogProvider>
                        </PromptDialogProvider>
                    </ConfirmDialogProvider>
                </ThemeProvider>
            </RawIntlProvider>
        </ApolloProvider>
    );
}

async function main () {
    const { store, persistor } = createDefaultStore();
    if (process.env.NODE_ENV !== `production`) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const axe = require(`react-axe`);
        // axe(React, ReactDOM, 1000);
    }

    if (window.location.host.split(`:`)[0] !== `localhost`) {
        redirectIfUnauthorized();
    }

    const div = document.getElementById(`app`);
    ReactDOM.render(<Router history={history}>
        <RecoilRoot>
            <Provider store={store}>
                <PersistGate
                    loading={null}
                    persistor={persistor}>
                    <ClientSide />
                </PersistGate>
            </Provider>
        </RecoilRoot>
    </Router>, div);
}

main();
