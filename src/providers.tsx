import App from "@/app";
import CmsApiClientProvider from "@/providers/CmsApiClient";
import ReportsApiClientProvider from "@/providers/ReportsApiClient";
import UserServiceProvider from "@/providers/UserServiceProvider";
import { createDefaultStore } from '@/store/store';
import { themeProvider } from "@/themeProvider";
import { getLanguage } from "@/utils/locale";
import { ReactQueryDevtools as CmsReactQueryDevtools } from "@kidsloop/cms-api-client";
import { ReactQueryDevtools as ReportsReactQueryDevtools } from "@kidsloop/reports-api-client";
import CssBaseline from "@mui/material/CssBaseline";
import {
    StyledEngineProvider,
    Theme,
    ThemeProvider,
} from "@mui/material/styles";
import {
    AlertDialogProvider,
    ConfirmDialogProvider,
    PromptDialogProvider,
    SnackbarProvider,
} from "kidsloop-px";
import React from 'react';
import { useCookies } from "react-cookie";
import { RawIntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { RecoilRoot } from 'recoil';
import { PersistGate } from 'redux-persist/integration/react';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

export function ClientSide () {
    const [ cookies ] = useCookies([ `locale` ]);
    const languageCode = cookies.locale;
    const locale = getLanguage(languageCode);

    return (
        <ReportsApiClientProvider>
            <CmsApiClientProvider>
                <UserServiceProvider>
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
                </UserServiceProvider>
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
                    persistor={persistor}
                >
                    <ClientSide />
                </PersistGate>
            </Provider>
        </RecoilRoot>
    );
}
