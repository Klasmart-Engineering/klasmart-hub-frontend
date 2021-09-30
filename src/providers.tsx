import App from "./app";
import { cache } from "./cache";
import { cancelRequestLink } from "./cancelRequest";
import { getAPIEndpoint } from "./config";
import {
    createDefaultStore,
    State,
} from './store/store';
import { themeProvider } from "./themeProvider";
import { history } from './utils/history';
import { getLanguage } from "./utils/locale";
import {
    ApolloClient,
    ApolloLink,
} from "@apollo/client/core";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { ApolloProvider } from "@apollo/client/react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { createUploadLink } from "apollo-upload-client";
import { sha256 } from 'crypto-hash';
import {
    AlertDialogProvider,
    ConfirmDialogProvider,
    PromptDialogProvider,
    SnackbarProvider,
    utils,
} from "kidsloop-px";
import React,
{ useMemo } from 'react';
import { useCookies } from "react-cookie";
import { RawIntlProvider } from "react-intl";
import {
    Provider,
    useSelector,
} from "react-redux";
import { Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { PersistGate } from 'redux-persist/integration/react';

const objectCleanerLink = new ApolloLink((operation, forward) => {
    operation.variables = utils.trimStrings(operation.variables); // clean request data
    return forward(operation).map((value) => utils.trimStrings(value)); // clean response data
});

const uploadLink = createUploadLink({
    credentials: `include`,
    uri: `${getAPIEndpoint()}user/`,
});

const persistedQueryLink = createPersistedQueryLink({
    sha256,
});

export const client = new ApolloClient({
    credentials: `include`,
    link: ApolloLink.from([
        objectCleanerLink,
        persistedQueryLink,
        cancelRequestLink,
        uploadLink,
    ]),
    cache,
    queryDeduplication: false,
});

export function ClientSide () {
    const memos = useMemo(() => {
        const url = new URL(window.location.href);
        const locale = url.searchParams.get(`iso`);
        return {
            hostName: url.hostname,
            locale,
        };
    }, []);

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

export default function ClientEntry () {
    const { store, persistor } = createDefaultStore();

    return (
        <Router history={history}>
            <RecoilRoot>
                <Provider store={store}>
                    <PersistGate
                        loading={null}
                        persistor={persistor}>
                        <ClientSide />
                    </PersistGate>
                </Provider>
            </RecoilRoot>
        </Router>
    );
}
