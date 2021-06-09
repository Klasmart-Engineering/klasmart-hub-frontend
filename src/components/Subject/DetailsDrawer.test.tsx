import DetailsDrawer from './DetailsDrawer';
import { getLanguage } from "@/utils/locale";
import {
    act,
    waitFor,
} from '@testing-library/react';
import { mockSubjects } from '@tests/mockDataSubjects';
import qlRender from '@tests/utils';
import React from 'react';

test(`Details drawer component renders and displays correct information`, async () => {
    const locale = getLanguage(`en`);
    const { queryByText } = qlRender([], locale, <DetailsDrawer
        value={mockSubjects[0]}
        open={true}
        onClose={jest.fn()}/>);

    await act(async () => {
        waitFor(() => {
            expect(queryByText(`Math Grade 5`)).toBeTruthy();
            expect(queryByText(`Algebra`)).toBeTruthy();
        });
    });
});
