import CategorySelectDialog from './CategorySelect';
import { GET_ALL_CATEGORIES } from '@/operations/queries/getAllCategories';
import { MockedResponse } from '@apollo/client/testing';
import { waitFor } from '@testing-library/react';
import {
    mockCategories,
    mockOrgId,
    mockSubjects,
} from '@tests/mockDataSubjects';
import { render } from "@tests/utils/render";
import React from 'react';
import { act } from 'react-test-renderer';

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_ALL_CATEGORIES,
            variables: {
                organization_id: mockOrgId,
            },
        },
        result: {
            data: {
                organization: {
                    categories: mockCategories,
                },
            },
        },
    },
];

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

test(`Category select renders correctly with correct data.`, async () => {
    const { findByText } = render(<CategorySelectDialog
        value={mockSubjects[0].node.categories[0]}
        open={true}
        onClose={jest.fn()}
    />, {
        mockedResponses: mocks,
    });

    expect(await findByText(/Fine Motor Skills/gi)).toBeInTheDocument();

});
