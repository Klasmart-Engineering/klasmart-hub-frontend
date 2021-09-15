import { fallbackLocale } from '@/locale/locale';
import {
    MockedProvider,
    MockedResponse,
} from '@apollo/client/testing';
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
                {component}
            </RawIntlProvider>
        </RecoilRoot>
    </MockedProvider>);
};
