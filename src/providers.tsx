import App from "./app";
import { cache } from "./cache";
import { getAPIEndpoint } from "./config";
import CmsApiClientProvider from "./providers/CmsApiClient";
import ReportsApiClientProvider from "./providers/ReportsApiClient";
import {
    createDefaultStore,
    State,
} from './store/store';
import { themeProvider } from "./themeProvider";
import { getLanguage } from "./utils/locale";
import {
    ApolloClient,
    ApolloLink,
} from "@apollo/client/core";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { ApolloProvider } from "@apollo/client/react";
import { ReactQueryDevtools as CmsReactQueryDevtools } from "@kidsloop/cms-api-client";
import { ReactQueryDevtools as ReportsReactQueryDevtools } from "@kidsloop/reports-api-client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
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
import { RecoilRoot } from 'recoil';
import { PersistGate } from 'redux-persist/integration/react';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


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
        uploadLink,
    ]),
    cache,
    queryDeduplication: true,
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
        <ReportsApiClientProvider>
            <CmsApiClientProvider>
                <ApolloProvider client={client}>
                    <RawIntlProvider value={locale}>
                        <StyledEngineProvider injectFirst>
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
                        </StyledEngineProvider>
                    </RawIntlProvider>
                </ApolloProvider>
                {process.env.NODE_ENV === `development` && <CmsReactQueryDevtools position="bottom-right" />}
            </CmsApiClientProvider>
            {process.env.NODE_ENV === `development` && <ReportsReactQueryDevtools position="bottom-left"/>}
        </ReportsApiClientProvider>
    );
}

export default function ClientEntry () {
    const { store, persistor } = createDefaultStore();

    return (
        <RecoilRoot>
            <Provider store={store}>
                <PersistGate
                    loading={null}
                    persistor={persistor}>
                    <ClientSide />
                </PersistGate>
            </Provider>
        </RecoilRoot>
    );
}
