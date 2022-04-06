import LDProvider from "./feature-flag/LDProvider";
import App from "@/app";
import CmsApiClientProvider from "@/providers/CmsApiClient";
import ReportsApiClientProvider from "@/providers/ReportsApiClient";
import UserServiceProvider from "@/providers/UserServiceProvider";
import { useThemeProvider } from "@/themeProvider";
import { getLanguage } from "@/utils/locale";
import { ReactQueryDevtools as CmsReactQueryDevtools } from "@kl-engineering/cms-api-client";
import {
    AlertDialogProvider,
    ConfirmDialogProvider,
    PromptDialogProvider,
    SnackbarProvider,
} from "@kl-engineering/kidsloop-px";
import { ReactQueryDevtools as ReportsReactQueryDevtools } from "@kl-engineering/reports-api-client";
import CssBaseline from "@mui/material/CssBaseline";
import {
    StyledEngineProvider,
    Theme,
    ThemeProvider,
} from "@mui/material/styles";
import React from 'react';
import { useCookies } from "react-cookie";
import { RawIntlProvider } from "react-intl";
import { RecoilRoot } from 'recoil';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme { }
}

export function ClientSide () {
    const [ cookies ] = useCookies([ `locale` ]);
    const languageCode = cookies.locale;
    const locale = getLanguage(languageCode);

    return (
        <UserServiceProvider>
            <ReportsApiClientProvider>
                <CmsApiClientProvider>
                    <LDProvider>
                        <RawIntlProvider value={locale}>
                            <StyledEngineProvider injectFirst>
                                <ThemeProvider theme={useThemeProvider()}>
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
                    </LDProvider>
                    {process.env.NODE_ENV === `development` && <CmsReactQueryDevtools position="bottom-right" />}
                </CmsApiClientProvider>
                {process.env.NODE_ENV === `development` && <ReportsReactQueryDevtools position="bottom-left" />}
            </ReportsApiClientProvider>
        </UserServiceProvider>
    );
}

export default function ClientEntry () {
    return (
        <RecoilRoot>
            <ClientSide />
        </RecoilRoot>
    );
}
