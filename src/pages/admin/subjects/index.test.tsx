import SubjectsPage from './index';
import {
    buildOrganizationSubjectFilter,
    GET_PAGINATED_ORGANIZATION_SUBJECTS,
} from "@/operations/queries/getPaginatedOrganizationSubjects";
import { MockedResponse } from "@apollo/client/testing";
import {
    screen,
    waitFor,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { mockProgramsFilterList } from '@tests/mockDataPrograms';
import {
    mockOrgId,
    mockSearchSubjects,
    mockSubjects,
} from "@tests/mockDataSubjects";
import { render } from "@tests/utils/render";
import React from 'react';

const mockQueryVariables = {
    direction: `FORWARD`,
    count: 10,
    orderBy: `name`,
    order: `ASC`,
    filter: buildOrganizationSubjectFilter({
        organizationId: mockOrgId,
        search: ``,
        filters: [],
    }),
};

const mockSearchQueryVariables = {
    direction: `FORWARD`,
    count: 10,
    orderBy: `name`,
    order: `ASC`,
    filter: buildOrganizationSubjectFilter({
        organizationId: mockOrgId,
        search: `Mock Subject`,
        filters: [],
    }),
};

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_SUBJECTS,
            variables: mockQueryVariables,
        },
        result: {
            data: {
                subjectsConnection: mockSubjects,
            },
        },
    },
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_SUBJECTS,
            variables: mockSearchQueryVariables,
        },
        result: {
            data: {
                subjectsConnection: mockSearchSubjects,
            },
        },
    },
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_SUBJECTS,
            variables: {
                direction: `FORWARD`,
                count: 50,
                order: `ASC`,
                orderBy: `name`,
                filter: buildOrganizationSubjectFilter({
                    organizationId: mockOrgId,
                    search: ``,
                    filters: [],
                }),
            },
        },
        result: {
            data: mockProgramsFilterList,
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

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

test(`Subjects page renders without records`, async () => {
    render(<SubjectsPage />);

    await waitFor(() => {
        expect(screen.queryByText(`Subjects`)).toBeTruthy();
        expect(screen.queryByText(`No records to display`)).toBeTruthy();
    });
});

test(`Subjects page renders with correct subjects names`, async () => {
    render(<SubjectsPage />, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.queryByText(`Subjects`)).toBeTruthy();
        expect(screen.queryByText(`Math Grade 5`)).toBeTruthy();
        expect(screen.queryByText(`Math Grade 6`)).toBeTruthy();
        expect(screen.queryByText(`Math Grade 7`)).toBeTruthy();
        expect(screen.queryByText(`Math Grade 1`)).toBeTruthy();
        expect(screen.queryByText(`Math Grade 2`)).toBeTruthy();
        expect(screen.queryByText(`Math Grade 10`)).toBeTruthy();
        expect(screen.queryByText(`Math Grade 9`)).toBeTruthy();
        expect(screen.queryByText(`Math Grade 8`)).toBeTruthy();
        expect(screen.queryByText(`Math Grade 7`)).toBeTruthy();
        expect(screen.queryByText(`Math Grade 4`)).toBeTruthy();
    });
});

test(`Subjects page results render when searching by name`, async () => {
    render(<SubjectsPage />, {
        mockedResponses: mocks,
    });

    await waitForElementToBeRemoved(() => screen.queryByRole(`progressbar`));

    userEvent.type(screen.getByPlaceholderText(`Search`), `Mock Subject`);

    await waitForElementToBeRemoved(() => screen.queryByRole(`progressbar`));

    expect(await screen.findByText(`Mock Subject`)).toBeInTheDocument();
    expect(screen.queryByText(`Subject Grade 3`)).not.toBeInTheDocument();
});
