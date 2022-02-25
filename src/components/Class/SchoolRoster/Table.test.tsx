import SchoolRosterTable from './Table';
import {
    screen,
    waitFor,
} from "@testing-library/react";
import { render } from "@tests/utils/render";
import React from 'react';

const defaultProps = {
    open: true,
    organizationId: `test`,
    classId: `test`,
    refetchClassRoster: jest.fn(),
    onClose: jest.fn(),
};

describe(`School roster`, () => {
    describe(`Render`, () => {
        test(`columns`, async () => {
            const component = <SchoolRosterTable {...defaultProps} />;

            render(component);

            await waitFor(() => {
                expect(screen.queryAllByText(`Given Name`).length).toBeTruthy();
                expect(screen.queryAllByText(`Family Name`).length).toBeTruthy();
                expect(screen.queryAllByText(`Participating As`).length).toBeTruthy();
                expect(screen.queryAllByText(`Contact Info`).length).toBeTruthy();
                expect(screen.queryAllByText(`Organization Roles`).length).toBeTruthy();
            });
        });
    });
});
