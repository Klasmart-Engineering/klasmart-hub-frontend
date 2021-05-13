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
        getByText,
        getByLabelText,
    } = qlRender([], locale, <CreateSubjectDialog
        open={true}
        onClose={jest.fn()}/>);

    await act(async () => {
        const title = getByText(`Create Subject`);
        const name = await getByLabelText(`Subject Name`);
        const categoryLabels = await screen.findAllByText(/category/gi);
        const subcategoryLabels = await screen.findAllByText(/subcategories/gi);

        await waitFor(() => {
            expect(title).toBeTruthy();
            expect(name).toBeTruthy();
            expect(categoryLabels.length).toBeTruthy();
            expect(subcategoryLabels.length).toBeTruthy();
            expect(name.value).toBe(``);
        });
    });
});
