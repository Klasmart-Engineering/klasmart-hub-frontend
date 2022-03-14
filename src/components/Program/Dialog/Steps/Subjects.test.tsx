import SubjectStep from './Subjects';
import { buildEmptyProgram } from '@/utils/programs';
import {
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import { mockOrgId } from "@tests/mockDataSubjects";
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

test(`Subjects step renders correctly.`, async () => {
    render(<SubjectStep
        value={buildEmptyProgram()}
        isEdit={false}
    />, {
        mockedResponses: [],
    });

    await waitForElementToBeRemoved(() => screen.queryByRole(`progressbar`));

    expect(screen.getByText(`Subjects`)).toBeInTheDocument();
    expect(screen.getAllByText(`Name`)).toHaveLength(2);
    expect(screen.getAllByText(`Categories`)).toHaveLength(2);
    expect(screen.getAllByText(`Type`)).toHaveLength(2);
});
