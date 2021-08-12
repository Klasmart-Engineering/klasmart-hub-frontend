import 'regenerator-runtime/runtime';
import {
    MockedProvider,
    MockedResponse,
} from '@apollo/client/testing';
import { render } from '@testing-library/react';
import React,
{ ReactNode } from 'react';
import {
    IntlShape,
    RawIntlProvider,
} from 'react-intl';
import { RecoilRoot } from 'recoil';

export default (mocks: MockedResponse[], locale: IntlShape, component: ReactNode) => (
    render(<MockedProvider
        mocks={mocks}
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
    </MockedProvider>)
);
