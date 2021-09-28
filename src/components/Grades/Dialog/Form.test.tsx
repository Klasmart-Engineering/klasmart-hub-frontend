import GradeDialogForm from './Form';
import { GET_GRADES } from '@/operations/queries/getGrades';
import { MockedResponse } from '@apollo/client/testing';
import {
    act,
    fireEvent,
    screen,
    waitFor,
} from '@testing-library/react';
import {
    grades,
    mockOrgId,
} from '@tests/mockDataGrades';
import { render } from "@tests/utils/render";
import { utils } from 'kidsloop-px';
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

const formValue = {
    name: ``,
    progress_from_grade: null,
    progress_to_grade: null,
};

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_GRADES,
            variables: {
                organization_id: mockOrgId,
            },
        },
        result: {
            data: {
                organization: {
                    grades,
                },
            },
        },
    },
];

test(`Grades form renders correctly`, async () => {
    render(<GradeDialogForm
        value={formValue}
        onChange={jest.fn()}
        onValidation={jest.fn()}/>, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.getByLabelText(`Grade Name`)).toBeInTheDocument();
        expect(screen.getByLabelText(`Progress From`)).toBeInTheDocument();
        expect(screen.getByLabelText(`Progress To`)).toBeInTheDocument();
        expect(screen.getByLabelText(`Grade Name`)?.value).toBe(``);
    });
});

test(`Grades form updates correctly`, async () => {
    render(<GradeDialogForm
        value={formValue}
        onChange={jest.fn()}
        onValidation={jest.fn()}/>, {
        mockedResponses: mocks,
    });

    const name = screen.getByLabelText(`Grade Name`, {
        selector: `input`,
    });
    const pFrom = screen.getAllByRole(`button`)[0];
    const pTo = screen.getAllByRole(`button`)[1];

    fireEvent.change(name, {
        target: {
            value: `Test Grade`,
        },
    });

    await utils.sleep(0);

    // Grade name
    await waitFor(() => {
        expect(name.value).toBe(`Test Grade`);
    });

    fireEvent.mouseDown(pFrom);
    await utils.sleep(0);
    const foundFrom = screen.queryByText(/Grade 1/i);

    await utils.sleep(0);

    // Find grade 1
    await waitFor(() => {
        expect(foundFrom).toBeInTheDocument();
        expect(screen.queryAllByText(/System Values/i).length).toBeTruthy();
    });

    fireEvent.click(foundFrom as HTMLElement);

    await utils.sleep(0);
    const grade1Found = screen.getAllByText(/Grade 1/i);

    // Grade 1 should be chosen.
    await waitFor(() => {
        expect(grade1Found).toHaveLength(1);
        expect(screen.queryAllByText(/System Values/i).length).toBeFalsy();
    });

    fireEvent.mouseDown(pTo);
    await utils.sleep(0);
    const foundTo = screen.queryByText(/Grade 2/i);

    await waitFor(() => {
        expect(foundTo).toBeInTheDocument();
        expect(screen.queryAllByText(/System Values/i).length).toBeTruthy();
    });

    fireEvent.click(foundTo as HTMLElement);

    await utils.sleep(0);
    const grade2Found = screen.getAllByText(/Grade 2/i);

    await waitFor(() => {
        expect(grade2Found).toHaveLength(1);
        expect(screen.queryAllByText(/System Values/i).length).toBeFalsy();
    });
});
