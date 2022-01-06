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
import {
    mockOrgId,
    mockUserId,
} from '@tests/mockDataClasses';
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
            organization_id: mockOrgId,
        }),
        useCurrentOrganizationMembership: () => ({
            organization_id: mockOrgId,
        }),
    };
});

jest.mock(`@apollo/client`, () => {
    return {
        ...jest.requireActual(`@apollo/client`),
        useReactiveVar: () => mockUserId,
    };
});

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_SCHOOLS,
            variables: {
                direction: `FORWARD`,
                count: 50,
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
        onValidation={jest.fn()}/>, {
        mockedResponses: mocks,
    });

    expect(screen.queryAllByText(`Class name`).length).toBeTruthy();
    expect(screen.queryAllByText(`Schools (optional)`).length).toBeTruthy();
    expect(screen.queryAllByText(`Program (optional)`).length).toBeTruthy();
    expect(screen.queryAllByText(`Grade (optional)`).length).toBeTruthy();
    expect(screen.queryAllByText(`Age range (optional)`).length).toBeTruthy();
    expect(screen.queryAllByText(`Subjects (optional)`).length).toBeTruthy();

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
