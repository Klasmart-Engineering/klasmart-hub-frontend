import CreateSubjectDialog from './Create';
import {
    act,
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
    const {
        queryByText,
        queryByLabelText,
    } = render(<CreateSubjectDialog
        open={true}
        onClose={jest.fn()}/>);

    await act(async () => {
        await waitFor(() => {
            expect(queryByText(`Create Subject`)).toBeTruthy();
            expect(queryByLabelText(`Subject Name`)).toBeTruthy();
            expect(screen.queryAllByText(/category/gi).length).toBeTruthy();
            expect(screen.queryAllByText(/subcategories/gi).length).toBeTruthy();
            expect(queryByLabelText(`Subject Name`)?.value).toBe(``);
        });
    });
});
