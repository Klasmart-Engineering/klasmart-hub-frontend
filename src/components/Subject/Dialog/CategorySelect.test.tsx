import CategorySelectDialog from './CategorySelect';
import { GET_ALL_CATEGORIES } from '@/operations/queries/getAllCategories';
import { getLanguage } from '@/utils/locale';
import { MockedResponse } from '@apollo/client/testing';
import { waitFor } from '@testing-library/react';
import {
    mockCategories,
    mockOrgId,
    mockSubjects,
} from '@tests/mockDataSubjects';
import qlRender from '@tests/utils';
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
    const locale = getLanguage(`en`);
    const { findByText } = qlRender(mocks, locale, <CategorySelectDialog
        value={mockSubjects[0].categories[0]}
        open={true}
        onClose={jest.fn()}
    />);

    expect(await findByText(/Fine Motor Skills/gi)).toBeInTheDocument();

});
