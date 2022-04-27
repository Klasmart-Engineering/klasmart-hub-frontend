import ClassDialogForm from './Form';
import { GET_PAGINATED_ORGANIZATION_SCHOOLS } from '@/operations/queries/getPaginatedOrganizationSchools';
import { Status } from '@/types/graphQL';
import { buildEmptyClassForm } from '@/utils/classes';
import { MockedResponse } from '@apollo/client/testing';
import {
    fireEvent,
    screen,
    waitFor,
} from "@testing-library/react";
import { mockOrgId } from '@tests/mockDataClasses';
import {
    mockSchoolName2,
    mockSchoolsData,
} from '@tests/mockDataSchools';
import { render } from "@tests/utils/render";
import React from 'react';

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            id: mockOrgId,
        }),
    };
});

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_SCHOOLS,
            variables: {
                direction: `FORWARD`,
                count: 50,
                orderBy: `name`,
                order: `ASC`,
                filter: {
                    status: {
                        operator: `eq`,
                        value: Status.ACTIVE,
                    },
                },
            },
        },
        result: {
            data: mockSchoolsData,
        },
    },
];

test(`Class dialog form renders correctly`, async () => {
    render(<ClassDialogForm
        value={buildEmptyClassForm()}
        onChange={jest.fn()}
        onValidation={jest.fn()}
    />, {
        mockedResponses: mocks,
    });

    expect(screen.getAllByText(`Class name`).length).toBeTruthy();
    expect(screen.getAllByText(`Schools (optional)`).length).toBeTruthy();
    expect(screen.getAllByText(`Program (optional)`).length).toBeTruthy();
    expect(screen.getAllByText(`Grade (optional)`).length).toBeTruthy();
    expect(screen.getAllByText(`Age range (optional)`).length).toBeTruthy();
    expect(screen.getAllByText(`Subjects (optional)`).length).toBeTruthy();

    expect(screen.getByLabelText(`Schools (optional)`)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(`Class name`), {
        target: {
            value: `ABC1234`,
        },
    });

    await waitFor(() => {
        expect((screen.getByLabelText(`Class name`) as HTMLInputElement)?.value).toBe(`ABC1234`);
    });

    fireEvent.mouseDown(await screen.findByLabelText(`Schools (optional)`));

    expect(await screen.findByText(mockSchoolName2)).toBeInTheDocument();
});
