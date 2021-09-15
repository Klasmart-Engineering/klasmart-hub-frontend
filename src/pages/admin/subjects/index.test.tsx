import SubjectsPage from './index';
import {
    buildOrganizationSubjectFilter,
    GET_PAGINATED_ORGANIZATION_SUBJECTS,
} from "@/operations/queries/getPaginatedOrganizationSubjects";
import { MockedResponse } from "@apollo/client/testing";
import {
    act,
    fireEvent,
    waitFor,
} from "@testing-library/react";
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

test(`Subjects page renders without records`, async () => {
    const { queryByText } = render(<SubjectsPage />);

    await waitFor(() => {
        expect(queryByText(`Subjects`)).toBeTruthy();
        expect(queryByText(`No records to display`)).toBeTruthy();
    });
});

test(`Subjects page renders with correct subjects names`, async () => {
    const { queryByText } = render(<SubjectsPage />, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(queryByText(`Subjects`)).toBeTruthy();
        expect(queryByText(`Math Grade 5`)).toBeTruthy();
        expect(queryByText(`Math Grade 6`)).toBeTruthy();
        expect(queryByText(`Math Grade 7`)).toBeTruthy();
        expect(queryByText(`Math Grade 1`)).toBeTruthy();
        expect(queryByText(`Math Grade 2`)).toBeTruthy();
        expect(queryByText(`Math Grade 10`)).toBeTruthy();
        expect(queryByText(`Math Grade 9`)).toBeTruthy();
        expect(queryByText(`Math Grade 8`)).toBeTruthy();
        expect(queryByText(`Math Grade 7`)).toBeTruthy();
        expect(queryByText(`Math Grade 4`)).toBeTruthy();
    });
});

test(`Subjects page results render when searching by name`, async () => {
    const {
        queryAllByText,
        getByPlaceholderText,
        queryByText,
    } = render(<SubjectsPage />, {
        mockedResponses: mocks,
    });

    fireEvent.change(getByPlaceholderText(`Search`), {
        target: {
            value: `Mock Subject`,
        },
    });

    await waitFor(() => {
        expect(queryAllByText(`Mock Subject`)).toHaveLength(1);
        expect(queryByText(`Subject Grade 3`)).toBeFalsy();
    }, {
        timeout: 4000,
    });
});
