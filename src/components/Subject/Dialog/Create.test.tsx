import CreateSubjectDialog from './Create';
import {
    screen,
    waitFor,
} from '@testing-library/react';
import { mockOrgId } from '@tests/mockDataSubjects';
import { render } from "@tests/utils/render";
import React from 'react';

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            organization_id: mockOrgId,
        }),
        useCurrentOrganizationMembership: () => ({
            organization_id: mockOrgId,
        }),
    };
});

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

test(`Subject create dialog renders correctly`, async () => {
    render(<CreateSubjectDialog
        open={true}
        onClose={jest.fn()}/>);

    await waitFor(() => {
        expect(screen.queryByText(`Create Subject`)).toBeInTheDocument();
        expect(screen.queryByLabelText(`Subject Name`)).toBeInTheDocument();
        expect(screen.queryAllByText(/category/gi).length).toBeTruthy();
        expect(screen.queryAllByText(/subcategories/gi).length).toBeTruthy();
        expect(screen.queryByLabelText(`Subject Name`)?.value).toBe(``);
    });
});
