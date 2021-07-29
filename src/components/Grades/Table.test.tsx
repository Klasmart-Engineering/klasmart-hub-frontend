import 'regenerator-runtime/runtime';
import Grades from './Table';
import {  NON_SPECIFIED } from "@/types/graphQL";
import { getLanguage } from "@/utils/locale";
import {
    act,
    screen,
    waitFor,
} from "@testing-library/react";
import {
    grades,
    mockOrgId,
} from '@tests/mockDataGrades';
import qlRender from '@tests/utils';
import { utils } from "kidsloop-px";
import React from 'react';

const data = {
    gradesConnection: {
        totalCount: grades.length,
        pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: ``,
            endCursor: ``,
        },
        edges: grades,
    },
};

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

test(`Grades table page renders correctly`, async () => {
    const locale = getLanguage(`en`);

    const rows = data?.gradesConnection?.edges?.map((edge) => ({
        id: edge.id ?? ``,
        name: edge.name ?? ``,
        progressFrom: edge.progress_from_grade?.name ?? NON_SPECIFIED,
        progressTo: edge.progress_to_grade?.name ?? NON_SPECIFIED,
    })) ?? [];

    const component = <Grades
        order="asc"
        orderBy="name"
        rows={rows}
    />;
    const { queryAllByText } = qlRender([], locale, component);

    await act(async () => {
        const title = await screen.findByText(`Grades`);

        await waitFor(() => {
            expect(title).toBeTruthy();
        });

        await utils.sleep(0);

        await waitFor(() => {
            expect(queryAllByText(`Grade 1`)).toBeTruthy();
            expect(queryAllByText(`Grade 2`)).toBeTruthy();
            expect(queryAllByText(`Grade 3`)).toBeTruthy();
        });
    });
});
