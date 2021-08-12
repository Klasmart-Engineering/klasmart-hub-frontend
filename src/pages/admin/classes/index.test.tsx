import ClassesPage from './index';
import {
    buildOrganizationClassesFilter,
    GET_PAGINATED_ORGANIZATION_CLASSES,
} from "@/operations/queries/getPaginatedOrganizationClasses";
import { getLanguage } from "@/utils/locale";
import { MockedResponse } from "@apollo/client/testing";
import {
    act,
    screen,
    waitFor,
} from "@testing-library/react";
import {
    mockClasses,
    mockOrgId,
} from "@tests/mockDataClasses";
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
