import ClassesPage from './index';
import {
    buildOrganizationClassesFilter,
    GET_PAGINATED_ORGANIZATION_CLASSES,
} from "@/operations/queries/getPaginatedOrganizationClasses";
import {
    buildOrganizationProgramFilter,
    GET_PAGINATED_ORGANIZATION_PROGRAMS_LIST,
} from '@/operations/queries/getPaginatedOrganizationPrograms';
import { getLanguage } from "@/utils/locale";
import { MockedResponse } from "@apollo/client/testing";
import {
    act,
    fireEvent,
    waitFor,
} from "@testing-library/react";
import {
    mockClasses,
    mockOrgId,
    mockSearchClasses,
} from "@tests/mockDataClasses";
import { mockProgramsFilterList } from '@tests/mockDataPrograms';
import qlRender from "@tests/utils";
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

test(`Class page renders without records`, async () => {
    const locale = getLanguage(`en`);
    const { queryByText } = qlRender([], locale, <ClassesPage />);

    await act(async () => {
        await waitFor(() => {
            expect(queryByText(`Classes`)).toBeTruthy();
            expect(queryByText(`No records to display`)).toBeTruthy();
        });
    });
});

test(`Class page renders with correct class names`, async () => {
    const locale = getLanguage(`en`);
    const { queryByText } = qlRender(mocks, locale, <ClassesPage />);

    await act(async () => {
        await waitFor(() => {
            expect(queryByText(`Classes`)).toBeTruthy();
            expect(queryByText(`Class 6`)).toBeTruthy();
            expect(queryByText(`Class 7`)).toBeTruthy();
            expect(queryByText(`Class 9`)).toBeTruthy();
            expect(queryByText(`Class Grade 2`)).toBeTruthy();
            expect(queryByText(`Class Grade 3`)).toBeTruthy();
            expect(queryByText(`Elem 10`)).toBeTruthy();
            expect(queryByText(`Elem 8`)).toBeTruthy();
            expect(queryByText(`Elementary 5`)).toBeTruthy();
            expect(queryByText(`Grade 1 Class`)).toBeTruthy();
            expect(queryByText(`Last Class`)).toBeTruthy();
        });
    });
});

test(`Class page renders with correct program chips`, async () => {
    const locale = getLanguage(`en`);
    const { queryAllByText } = qlRender(mocks, locale, <ClassesPage />);

    await act(async () => {
        await waitFor(() => {
            expect(queryAllByText(`ESL`).length).toEqual(2);
            expect(queryAllByText(`Math`).length).toEqual(4);
            expect(queryAllByText(`Science`).length).toEqual(3);
            expect(queryAllByText(`Bada Genius`).length).toEqual(2);
            expect(queryAllByText(`Bada Math`).length).toEqual(2);
            expect(queryAllByText(`Bada Read`).length).toEqual(2);
            expect(queryAllByText(`Bada Rhyme`).length).toEqual(2);
            expect(queryAllByText(`Bada Sound`).length).toEqual(2);
            expect(queryAllByText(`Bada STEM`).length).toEqual(2);
            expect(queryAllByText(`Bada Talk`).length).toEqual(2);
            expect(queryAllByText(`Bada STEAM 1`).length).toEqual(2);
            expect(queryAllByText(`None Specified`).length).toEqual(2);
        });
    });
});

test(`Class page results render when searching by name`, async () => {
    const locale = getLanguage(`en`);
    const {
        queryAllByText,
        getByPlaceholderText,
        queryByText,
    } = qlRender(mocks, locale, <ClassesPage />);

    fireEvent.change(getByPlaceholderText(`Search`), {
        target: {
            value: `Mock Class`,
        },
    });

    await act(async () => {
        await waitFor(() => {
            expect(queryAllByText(`Mock Class`).length).toEqual(1);
            expect(queryByText(`Class Grade 3`)).toBeFalsy();
        }, {
            timeout: 4000,
        });
    });
});
