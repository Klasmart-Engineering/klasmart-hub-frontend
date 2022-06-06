import App from "@/app";
import LDProvider from "@/feature-flag/LDProvider";
import LocaleProvider from "@/locale/Provider";
import CmsApiClientProvider from "@/providers/CmsApiClient";
import ReportsApiClientProvider from "@/providers/ReportsApiClient";
import UserServiceProvider from "@/providers/UserServiceProvider";
import ThemeProvider from "@/theme/Provider";
import { ReactQueryDevtools as CmsReactQueryDevtools } from "@kl-engineering/cms-api-client";
import { GlobalStateProvider } from "@kl-engineering/frontend-state";
import {
    AlertDialogProvider,
    ConfirmDialogProvider,
    PromptDialogProvider,
    SnackbarProvider,
} from "@kl-engineering/kidsloop-px";
import { ReactQueryDevtools as ReportsReactQueryDevtools } from "@kl-engineering/reports-api-client";
import {
    StyledEngineProvider,
    Theme,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import React from 'react';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme { }
}

function ClientSide () {
    return (
        <UserServiceProvider>
            <ReportsApiClientProvider>
                <CmsApiClientProvider>
                    <LDProvider>
                        <LocaleProvider>
                            <StyledEngineProvider injectFirst>
                                <ThemeProvider>
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
                        </LocaleProvider>
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
        <GlobalStateProvider cookieDomain={process.env.COOKIE_DOMAIN ?? ``}>
            <ClientSide />
        </GlobalStateProvider>
    );
}
