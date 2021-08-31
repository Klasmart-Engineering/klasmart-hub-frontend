import EditSubjectDialog from './Edit';
import { Status } from '@/types/graphQL';
import {
    act,
    screen,
    waitFor,
} from '@testing-library/react';
import {
    mockCategories,
    mockOrgId,
} from '@tests/mockDataSubjects';
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

const formValue = {
    id: ``,
    name: `Math`,
    categories: mockCategories,
    status: Status.ACTIVE,
    system: false,
};

test(`Subject edit dialog renders correctly`, async () => {
    const {
        getByText,
        getByLabelText,
    } = render(<EditSubjectDialog
        value={formValue}
        open={true}
        onClose={jest.fn()}/>);

    await act(async () => {
        const title = getByText(`Edit Subject`);
        const name = await getByLabelText(`Subject Name`);
        const categoryLabels = await screen.findAllByText(/category/gi);
        const subcategoryLabels = await screen.findAllByText(/subcategories/gi);

        await waitFor(() => {
            expect(title).toBeTruthy();
            expect(name).toBeTruthy();
            expect(categoryLabels.length).toBeTruthy();
            expect(subcategoryLabels.length).toBeTruthy();
            expect(name.value).toBe(`Math`);
        });
    });
});
