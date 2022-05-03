import App from "@/app";
import LDProvider from "@/feature-flag/LDProvider";
import CmsApiClientProvider from "@/providers/CmsApiClient";
import ReportsApiClientProvider from "@/providers/ReportsApiClient";
import UserServiceProvider from "@/providers/UserServiceProvider";
import StateProvider from "@/state/Provider";
import ThemeProvider from "@/theme/Provider";
import { ReactQueryDevtools as CmsReactQueryDevtools } from "@kl-engineering/cms-api-client";
import { ReactQueryDevtools as ReportsReactQueryDevtools } from "@kl-engineering/reports-api-client";
import { Theme } from "@mui/material/styles";
import React from "react";

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme { }
}

export default function ClientEntry () {
    return (
        <StateProvider>
            <UserServiceProvider>
                <ReportsApiClientProvider>
                    <CmsApiClientProvider>
                        <ThemeProvider>
                            <LDProvider>
                                <App />
                            </LDProvider>
                        </ThemeProvider>
                        {process.env.NODE_ENV === `development` && <CmsReactQueryDevtools position="bottom-right" />}
                    </CmsApiClientProvider>
                    {process.env.NODE_ENV === `development` && <ReportsReactQueryDevtools position="bottom-left" />}
                </ReportsApiClientProvider>
            </UserServiceProvider>
        </StateProvider>
    );
}
