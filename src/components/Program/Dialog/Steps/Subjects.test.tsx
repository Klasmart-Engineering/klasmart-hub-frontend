import SubjectStep from './Subjects';
import { buildEmptyProgram } from '@/utils/programs';
import { screen } from "@testing-library/react";
import { mockOrgId } from "@tests/mockDataSubjects";
import { render } from "@tests/utils/render";
import React from 'react';

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

test(`Subjects step renders correctly.`, () => {
    render(<SubjectStep value={buildEmptyProgram()}/>, {
        mockedResponses: [],
    });

    expect(screen.queryByText(`Subjects`)).toBeTruthy();
    expect(screen.queryAllByText(`Name`).length).toBeTruthy();
    expect(screen.queryAllByText(`Categories`).length).toBeTruthy();
    expect(screen.queryAllByText(`Type`).length).toBeTruthy();
});
