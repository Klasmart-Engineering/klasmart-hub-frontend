import EditSubjectDialog from './Edit';
import { GET_SUBJECT } from '@/operations/queries/getSubject';
import { MockedResponse } from '@apollo/client/testing';
import { Status } from '@/types/graphQL';
import {
    act,
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
    id: mockSubjects[0].node.id,
    name: mockSubjects[0].node.name,
    categories: mockCategories,
    status: Status.ACTIVE,
    system: false,
};

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_SUBJECT,
            variables: {
                id: mockSubjects[0].node.id,
            },
        },
        result: {
            data: {
                subject: mockSubjects[0].node,
            },
        },
    },
];

test(`Subject edit dialog renders correctly`, async () => {
    const {
        getByText,
        getByLabelText,
    } = render(<EditSubjectDialog
        subjectId={formValue.id}
        open={true}
        onClose={jest.fn()}/>);

    await act(async () => {
        const title = getByText(`Edit Subject`);
        const name = await getByLabelText(`Subject Name`);

        await waitFor(() => {
            expect(title).toBeTruthy();
            expect(name).toBeTruthy();
        });
    });
});
