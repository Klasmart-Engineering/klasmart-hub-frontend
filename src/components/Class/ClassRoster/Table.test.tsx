import ClassRosterTable from './Table';
import {
    screen,
    waitFor,
} from "@testing-library/react";
import { render } from "@tests/utils/render";
import React from 'react';

test(`Class roster table loads correctly.`, async () => {
    render(<ClassRosterTable
        open={true}
        organizationId={`test`}
        onClose={jest.fn()}/>);

    await waitFor(() => {
        expect(screen.queryByText(`Class Roster`)).toBeInTheDocument();
        expect(screen.queryAllByText(`Given Name`).length).toBeTruthy();
        expect(screen.queryAllByText(`Family Name`).length).toBeTruthy();
        expect(screen.queryAllByText(`Participating As`).length).toBeTruthy();
        expect(screen.queryAllByText(`Contact Info`).length).toBeTruthy();
        expect(screen.queryAllByText(`Organization Roles`).length).toBeTruthy();
    });
});
