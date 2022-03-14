import GradesPage from './index';
import {
    buildGradeFilter,
    buildGradesFilters,
    GET_PAGINATED_ORGANIZATION_GRADES,
} from '@/operations/queries/getOrganizationGrades';
import { MockedResponse } from '@apollo/client/testing';
import {
    cleanup,
    screen,
    waitFor,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import {
    mockOrgId,
    mockPaginatedGrades,
} from '@tests/mockDataGrades';
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

afterEach(cleanup);

const paginationFilter = buildGradeFilter({
    organizationId: mockOrgId,
    search: ``,
    filters: buildGradesFilters([]),
});

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_GRADES,
            variables: {
                direction: `FORWARD`,
                count: 10,
                orderBy: `name`,
                order: `ASC`,
                filter: paginationFilter,
            },
        },
        result: {
            data: mockPaginatedGrades,
        },
    },
];

test(`Grades page loads correctly without data`, async () => {
    render(<GradesPage />);

    await waitForElementToBeRemoved(() => screen.queryByRole(`progressbar`));

    expect(screen.queryByText(`Grades`)).toBeInTheDocument();
    expect(screen.queryByText(`No records to display`)).toBeInTheDocument();
});

test(`Grades page loads correctly with data`, async () => {
    render(<GradesPage />, {
        mockedResponses: mocks,
    });

    await waitForElementToBeRemoved(() => screen.queryByRole(`progressbar`));

    expect(screen.queryByText(`Grades`)).toBeInTheDocument();
    expect(screen.queryByText(`Grade 3`)).toBeInTheDocument();
});
