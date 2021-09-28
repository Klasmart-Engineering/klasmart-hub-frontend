import 'regenerator-runtime/runtime';
import Grades from './Table';
import { NON_SPECIFIED } from "@/types/graphQL";
import {
    screen,
    waitFor,
} from "@testing-library/react";
import {
    grades,
    mockOrgId,
} from '@tests/mockDataGrades';
import { render } from "@tests/utils/render";
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

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

test(`Grades table page renders correctly`, async () => {
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

    render(component);

    await waitFor(() => {
        expect(screen.queryByText(`Grades`)).toBeInTheDocument();
        expect(screen.queryAllByText(`Grade 1`).length).toBeTruthy();
        expect(screen.queryAllByText(`Grade 2`).length).toBeTruthy();
        expect(screen.queryAllByText(`Grade 3`).length).toBeTruthy();
    });
});
