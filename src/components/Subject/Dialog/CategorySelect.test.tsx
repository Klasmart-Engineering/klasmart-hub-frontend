import CategorySelectDialog from './CategorySelect';
import { GET_ALL_CATEGORIES } from '@/operations/queries/getAllCategories';
import { MockedResponse } from '@apollo/client/testing';
import { screen } from '@testing-library/react';
import {
    mockCategories,
    mockOrgId,
    mockSubjects,
} from '@tests/mockDataSubjects';
import { render } from "@tests/utils/render";
import React from 'react';

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
            id: mockOrgId,
        }),
    };
});

test(`Category select renders correctly with correct data.`, async () => {
    render(<CategorySelectDialog
        value={mockSubjects.edges[0].node.categories[0]}
        open={true}
        onClose={jest.fn()}
    />, {
        mockedResponses: mocks,
    });

    expect(await screen.findByText(`Fine Motor Skills`)).toBeInTheDocument();
});
