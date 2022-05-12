import { fallbackLocale } from '@/locale/locale';
import {
    MockedProvider,
    MockedResponse,
} from '@apollo/client/testing';
import { GlobalStateProvider } from "@kl-engineering/frontend-state";
import {
    createTheme,
    StyledEngineProvider,
    ThemeProvider,
} from '@mui/material/styles';
import { render as reactTestingLibraryRender } from '@testing-library/react';
import React,
{ ReactNode } from 'react';
import {
    IntlShape,
    RawIntlProvider,
} from 'react-intl';

export interface RenderOptions {
    locale?: IntlShape;
    mockedResponses?: MockedResponse[];
}

const theme = createTheme();

export const render = (component: ReactNode, options: RenderOptions = {}) => {
    const {
        locale = fallbackLocale,
        mockedResponses,
    } = options;
    return reactTestingLibraryRender((
        <MockedProvider
            mocks={mockedResponses}
            defaultOptions={{
                watchQuery: {
                    fetchPolicy: `no-cache`,
                },
                query: {
                    fetchPolicy: `no-cache`,
                },
            }}
            addTypename={false}
        >
            <GlobalStateProvider cookieDomain={process.env.COOKIE_DOMAIN ?? ``}>
                <RawIntlProvider value={locale}>
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={theme}>
                            {component}
                        </ThemeProvider>
                    </StyledEngineProvider>
                </RawIntlProvider>
            </GlobalStateProvider>
        </MockedProvider>
    ));
};
