import DetailsDrawer from './DetailsDrawer';
import {
    act,
    waitFor,
} from '@testing-library/react';
import { mockSubjects } from '@tests/mockDataSubjects';
import { render } from "@tests/utils/render";
import React from 'react';

test(`Details drawer component renders and displays correct information`, async () => {
    const { queryByText } = render(<DetailsDrawer
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
