import { fallbackLocale } from '@/locale/locale';
import {
    MockedProvider,
    MockedResponse,
} from '@apollo/client/testing';
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
import { RecoilRoot } from 'recoil';

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
    return reactTestingLibraryRender(<MockedProvider
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
        <RecoilRoot>
            <RawIntlProvider value={locale}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        {component}
                    </ThemeProvider>
                </StyledEngineProvider>
            </RawIntlProvider>
        </RecoilRoot>
    </MockedProvider>);
};
