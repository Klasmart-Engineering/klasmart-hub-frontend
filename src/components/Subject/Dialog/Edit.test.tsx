import EditSubjectDialog from './Edit';
import { Status } from '@/types/graphQL';
import {
    screen,
    waitFor,
} from '@testing-library/react';
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
            id: mockOrgId,
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
    render(<EditSubjectDialog
        subjectId={formValue.id}
        open={true}
        onClose={jest.fn()}/>);

    await waitFor(() => {
        expect(screen.getByText(`Edit Subject`)).toBeInTheDocument();
        expect(screen.getByLabelText(`Subject Name`)).toBeInTheDocument();
    });
});
