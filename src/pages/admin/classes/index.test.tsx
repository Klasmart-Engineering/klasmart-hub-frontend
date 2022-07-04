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
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from '@testing-library/user-event';
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
        filters: [],
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
        filters: [],
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

test(`Class page renders without records`, async () => {
    render(<ClassesPage />);

    expect(await screen.findByText(`Classes`))
        .toBeInTheDocument();
    expect(screen.getByText(`No records to display`))
        .toBeInTheDocument();
});

test(`Class page renders with correct class names`, async () => {
    render(<ClassesPage />, {
        mockedResponses: mocks,
    });

    await waitForElementToBeRemoved(() => screen.queryByRole(`progressbar`));

    expect(screen.getByText(`Class 6`))
        .toBeInTheDocument();
    expect(screen.getByText(`Class 7`))
        .toBeInTheDocument();
    expect(screen.getByText(`Class 9`))
        .toBeInTheDocument();
    expect(screen.getByText(`Class Grade 2`))
        .toBeInTheDocument();
    expect(screen.getByText(`Class Grade 3`))
        .toBeInTheDocument();
    expect(screen.getByText(`Elem 10`))
        .toBeInTheDocument();
    expect(screen.getByText(`Elem 8`))
        .toBeInTheDocument();
    expect(screen.getByText(`Elementary 5`))
        .toBeInTheDocument();
    expect(screen.getByText(`Grade 1 Class`))
        .toBeInTheDocument();
    expect(screen.getByText(`Last Class`))
        .toBeInTheDocument();
});

test(`Class page renders with correct program chips`, async () => {
    render(<ClassesPage />, {
        mockedResponses: mocks,
    });

    await waitForElementToBeRemoved(() => screen.queryByRole(`progressbar`));

    expect(screen.getAllByText(`ESL`))
        .toHaveLength(2);
    expect(screen.getAllByText(`Math`))
        .toHaveLength(2);
    expect(screen.getAllByText(`Science`))
        .toHaveLength(2);
    expect(screen.getAllByText(`Bada Genius`))
        .toHaveLength(2);
    expect(screen.getAllByText(`Bada Math`))
        .toHaveLength(2);
    expect(screen.getAllByText(`Bada Read`))
        .toHaveLength(2);
    expect(screen.getAllByText(`Bada Rhyme`))
        .toHaveLength(2);
    expect(screen.getAllByText(`Bada Sound`))
        .toHaveLength(2);
    expect(screen.getAllByText(`Bada STEM`))
        .toHaveLength(2);
    expect(screen.getAllByText(`Bada Talk`))
        .toHaveLength(2);
    expect(screen.getAllByText(`Bada STEAM 1`))
        .toHaveLength(2);
    expect(screen.getAllByText(`None Specified`))
        .toHaveLength(2);
});

test(`Class page results render when searching by name`, async () => {
    render(<ClassesPage />, {
        mockedResponses: mocks,
    });

    await waitForElementToBeRemoved(() => screen.queryByRole(`progressbar`));

    userEvent.type(screen.getByPlaceholderText(`Search`), `Mock Class`);

    await waitForElementToBeRemoved(() => screen.queryByRole(`progressbar`));

    expect(await screen.findByText(`Mock Class`))
        .toBeInTheDocument();
    expect(screen.queryByText(`Class Grade 3`)).not.toBeInTheDocument();
});
