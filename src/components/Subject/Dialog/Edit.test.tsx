import EditSubjectDialog from './Edit';
import { Status } from '@/types/graphQL';
import { waitFor } from '@testing-library/react';
import {
    mockCategories,
    mockOrgId,
    mockSubjects,
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
    id: mockSubjects.edges[0].node.id,
    name: mockSubjects.edges[0].node.name,
    categories: mockCategories,
    status: Status.ACTIVE,
    system: false,
};

test(`Subject edit dialog renders correctly`, async () => {
    const {
        getByText,
        getByLabelText,
    } = render(<EditSubjectDialog
        subjectId={formValue.id}
        open={true}
        onClose={jest.fn()}/>);

    const title = getByText(`Edit Subject`);
    const name = await getByLabelText(`Subject Name`);

    await waitFor(() => {
        expect(title).toBeTruthy();
        expect(name).toBeTruthy();
    });
});
