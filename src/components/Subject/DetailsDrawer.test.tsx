import DetailsDrawer from './DetailsDrawer';
import { getLanguage } from "@/utils/locale";
import {
    act,
    fireEvent,
    waitFor,
} from '@testing-library/react';
import { mockSubjects } from '@tests/mockDataSubjects';
import qlRender from '@tests/utils';
import { utils } from 'kidsloop-px';
import React from 'react';

test(`Details drawer component renders and displays correct information`, async () => {
    const locale = getLanguage(`en`);
    const { findByText } = qlRender([], locale, <DetailsDrawer
        value={mockSubjects[0]}
        open={true}
        onClose={jest.fn()}/>);

    await act(async () => {
        const algebra = await findByText(`Algebra`);
        await waitFor(() => {
            expect(findByText(`Math Grade 5`)).toBeTruthy();
            expect(algebra).toBeTruthy();
        });

        fireEvent.click(algebra);

        utils.sleep(0);

        await waitFor(() => {
            expect(findByText(`Hand-Eye`)).toBeTruthy();
        });
    });
});
