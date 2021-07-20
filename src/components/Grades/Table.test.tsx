import 'regenerator-runtime/runtime';
import Grades from './Table';
import {
    buildGradeFilter,
    GET_PAGINATED_ORGANIZATION_GRADES,
} from '@/operations/queries/getOrganizationGrades';
import { getLanguage } from "@/utils/locale";
import { MockedResponse } from '@apollo/client/testing';
import {
    act,
    waitFor,
} from '@testing-library/react';
import {
    mockOrgId,
    mockPaginatedGrades,
} from '@tests/mockDataGrades';
import qlRender from '@tests/utils';
import React from 'react';

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_GRADES,
            variables: {
                direction: `FORWARD`,
                count: 10,
                orderBy: `name`,
                order: `ASC`,
                filter: buildGradeFilter({
                    organizationId: mockOrgId,
                    search: ``,
                }),
            },
        },
        result: {
            data: mockPaginatedGrades,
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

jest.mock(`@/utils/checkAllowed`, () => {
    return {
        ...jest.requireActual(`@/utils/checkAllowed`),
        usePermission: () => true,
    };
});

test(`Grades page renders correctly`, async () => {
    const locale = getLanguage(`en`);
    const { findByText, queryByText } = qlRender(mocks, locale, <Grades />);

    await act(async () => {
        const noRecords = await findByText(`No data found`);

        await waitFor(() => {
            expect(noRecords).toBeTruthy();
        });

        await waitFor(() => {
            expect(queryByText(`Grade 3`)).toBeTruthy();
        });

    });
});
