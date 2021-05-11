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

export default (mocks: MockedResponse[], locale: IntlShape, component: ReactNode) => (
    render(<MockedProvider
        mocks={mocks}
        defaultOptions={{
            watchQuery: {
                fetchPolicy: `no-cache`,
            },
        }}
        addTypename={false}>
        <RawIntlProvider value={locale}>
            {component}
        </RawIntlProvider>
    </MockedProvider>)
);
