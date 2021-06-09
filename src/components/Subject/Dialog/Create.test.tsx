import CreateSubjectDialog from './Create';
import { getLanguage } from '@/utils/locale';
import {
    act,
    screen,
    waitFor,
} from '@testing-library/react';
import { mockOrgId } from '@tests/mockDataSubjects';
import qlRender from '@tests/utils';
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

jest.mock(`@/utils/checkAllowed`, () => {
    return {
        ...jest.requireActual(`@/utils/checkAllowed`),
        usePermission: () => true,
    };
});

test(`Subject create dialog renders correctly`, async () => {
    const locale = getLanguage(`en`);
    const {
        queryByText,
        queryByLabelText,
    } = qlRender([], locale, <CreateSubjectDialog
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
