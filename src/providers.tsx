import App from "@/app";
import CmsApiClientProvider from "@/providers/CmsApiClientProvider";
import UserServiceProvider from "@/providers/UserServiceProvider";
import {
    createDefaultStore,
    State,
} from '@/store/store';
import { themeProvider } from "@/themeProvider";
import { getLanguage } from "@/utils/locale";
import { ReactQueryDevtools } from "@kidsloop/cms-api-client";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import {
    AlertDialogProvider,
    ConfirmDialogProvider,
    PromptDialogProvider,
    SnackbarProvider,
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
        <CmsApiClientProvider>
            <UserServiceProvider>
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
            </UserServiceProvider>
            {process.env.NODE_ENV === `development` && <ReactQueryDevtools />}
        </CmsApiClientProvider>
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
