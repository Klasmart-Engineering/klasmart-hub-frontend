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
import { Theme } from "@mui/material";

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme { }
}

export default function ClientEntry () {
    return (
        <GlobalStateProvider cookieDomain={process.env.COOKIE_DOMAIN ?? ``}>
            <UserServiceProvider>
                <ReportsApiClientProvider>
                    <CmsApiClientProvider>
                        <LDProvider>
                            <LocaleProvider>
                                <ThemeProvider>
                                    <ConfirmDialogProvider>
                                        <PromptDialogProvider>
                                            <AlertDialogProvider>
                                                <SnackbarProvider closeButtonLabel="Dismiss">
                                                    <App />
                                                </SnackbarProvider>
                                            </AlertDialogProvider>
                                        </PromptDialogProvider>
                                    </ConfirmDialogProvider>
                                </ThemeProvider>
                            </LocaleProvider>
                        </LDProvider>
                        {process.env.NODE_ENV === `development` && <CmsReactQueryDevtools position="bottom-right" />}
                    </CmsApiClientProvider>
                    {process.env.NODE_ENV === `development` && <ReportsReactQueryDevtools position="bottom-left" />}
                </ReportsApiClientProvider>
            </UserServiceProvider>
        </GlobalStateProvider>
    );
}
