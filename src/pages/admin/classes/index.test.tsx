import ClassesPage from './index';
import {
    buildOrganizationClassesFilter,
    GET_PAGINATED_ORGANIZATION_CLASSES,
} from "@/operations/queries/getPaginatedOrganizationClasses";
import {
    buildOrganizationProgramFilter,
    GET_PAGINATED_ORGANIZATION_PROGRAMS_LIST,
} from '@/operations/queries/getPaginatedOrganizationPrograms';
import { MockedResponse } from "@apollo/client/testing";
import {
    cleanup,
    fireEvent,
    screen,
    waitFor,
} from "@testing-library/react";
import {
    mockClasses,
    mockOrgId,
    mockSearchClasses,
} from "@tests/mockDataClasses";
import { mockProgramsFilterList } from '@tests/mockDataPrograms';
import { render } from "@tests/utils/render";
import React from 'react';

const mockQueryVariables = {
    direction: `FORWARD`,
    count: 10,
    orderBy: `name`,
    order: `ASC`,
    filter: buildOrganizationClassesFilter({
        organizationId: mockOrgId,
        search: ``,
        filters:  [],
    }),
};

const mockSearchQueryVariables = {
    direction: `FORWARD`,
    count: 10,
    orderBy: `name`,
    order: `ASC`,
    filter: buildOrganizationClassesFilter({
        organizationId: mockOrgId,
        search: `Mock Class`,
        filters:  [],
    }),
};

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_CLASSES,
            variables: mockQueryVariables,
        },
        result: {
            data: {
                classesConnection: mockClasses,
            },
        },
    },
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_CLASSES,
            variables: mockSearchQueryVariables,
        },
        result: {
            data: {
                classesConnection: mockSearchClasses,
            },
        },
    },
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_PROGRAMS_LIST,
            variables: {
                direction: `FORWARD`,
                count: 50,
                order: `ASC`,
                orderBy: `name`,
                filter: buildOrganizationProgramFilter({
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

afterEach(cleanup);

test(`Class page renders without records`, () => {
    render(<ClassesPage />);

    expect(screen.queryByText(`Classes`)).toBeInTheDocument();
    expect(screen.queryByText(`No records to display`)).toBeInTheDocument();
});

test(`Class page renders with correct class names`, async () => {
    render(<ClassesPage />, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.queryByText(`Classes`)).toBeInTheDocument();
        expect(screen.queryByText(`Class 6`)).toBeInTheDocument();
        expect(screen.queryByText(`Class 7`)).toBeInTheDocument();
        expect(screen.queryByText(`Class 9`)).toBeInTheDocument();
        expect(screen.queryByText(`Class Grade 2`)).toBeInTheDocument();
        expect(screen.queryByText(`Class Grade 3`)).toBeInTheDocument();
        expect(screen.queryByText(`Elem 10`)).toBeInTheDocument();
        expect(screen.queryByText(`Elem 8`)).toBeInTheDocument();
        expect(screen.queryByText(`Elementary 5`)).toBeInTheDocument();
        expect(screen.queryByText(`Grade 1 Class`)).toBeInTheDocument();
        expect(screen.queryByText(`Last Class`)).toBeInTheDocument();
    });
});

test(`Class page renders with correct program chips`, async () => {
    render(<ClassesPage />, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.queryAllByText(`ESL`)).toHaveLength(2);
        expect(screen.queryAllByText(`Math`)).toHaveLength(4);
        expect(screen.queryAllByText(`Science`)).toHaveLength(3);
        expect(screen.queryAllByText(`Bada Genius`)).toHaveLength(2);
        expect(screen.queryAllByText(`Bada Math`)).toHaveLength(2);
        expect(screen.queryAllByText(`Bada Read`)).toHaveLength(2);
        expect(screen.queryAllByText(`Bada Rhyme`)).toHaveLength(2);
        expect(screen.queryAllByText(`Bada Sound`)).toHaveLength(2);
        expect(screen.queryAllByText(`Bada STEM`)).toHaveLength(2);
        expect(screen.queryAllByText(`Bada Talk`)).toHaveLength(2);
        expect(screen.queryAllByText(`Bada STEAM 1`)).toHaveLength(2);
        expect(screen.queryAllByText(`None Specified`)).toHaveLength(2);
    });
});

test(`Class page results render when searching by name`, async () => {
    render(<ClassesPage />, {
        mockedResponses: mocks,
    });

    fireEvent.change(screen.getByPlaceholderText(`Search`), {
        target: {
            value: `Mock Class`,
        },
    });

    await waitFor(() => {
        expect(screen.queryAllByText(`Mock Class`)).toHaveLength(1);
        expect(screen.queryByText(`Class Grade 3`)).toBeFalsy();
    }, {
        timeout: 4000,
    });
});
