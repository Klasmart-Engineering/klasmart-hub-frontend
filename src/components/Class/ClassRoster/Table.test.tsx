import ClassRosterTable from './Table';
import { screen } from "@testing-library/react";
import { render } from "@tests/utils/render";
import React from 'react';

test(`Class roster table loads correctly.`, () => {
    render(<ClassRosterTable
        open
        organizationId={`test`}
        onClose={jest.fn()}
           />);

    expect(screen.getByText(`Class Roster`)).toBeInTheDocument();
    expect(screen.getAllByText(`Given Name`).length).toBeTruthy();
    expect(screen.getAllByText(`Family Name`).length).toBeTruthy();
    expect(screen.getAllByText(`Participating As`).length).toBeTruthy();
    expect(screen.getAllByText(`Contact Info`).length).toBeTruthy();
    expect(screen.getAllByText(`Organization Roles`).length).toBeTruthy();
});
