import GradeDialogForm from './Form';
import { GET_GRADES } from '@/operations/queries/getGrades';
import { getLanguage } from "@/utils/locale";
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
import qlRender from '@tests/utils';
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
    const locale = getLanguage(`en`);
    const { getByLabelText } = qlRender(mocks, locale, <GradeDialogForm
        value={formValue}
        onChange={jest.fn()}
        onValidation={jest.fn()}/>);

    await act(async () => {
        const name = await getByLabelText(`Grade Name`);
        const pFrom = await getByLabelText(`Progress From`);
        const pTo = await getByLabelText(`Progress To`);

        await waitFor(() => {
            expect(name).toBeTruthy();
            expect(pFrom).toBeTruthy();
            expect(pTo).toBeTruthy();
            expect(name.value).toBe(``);
        });
    });
});

test(`Grades form updates correctly`, async () => {
    const locale = getLanguage(`en`);
    const {
        getByLabelText,
        getByTestId,
        getAllByText,
        getAllByRole,
    } = qlRender(mocks, locale, <GradeDialogForm
        value={formValue}
        onChange={jest.fn()}
        onValidation={jest.fn()}/>);

    await act(async () => {
        const name = await getByLabelText(`Grade Name`, {
            selector: `input`,
        });
        const pFrom = await getAllByRole(`button`)[0];
        const pTo = await getAllByRole(`button`)[1];

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

        await fireEvent.mouseDown(pFrom);
        await utils.sleep(0);
        const foundFrom = screen.queryByText(/Grade 1/i);

        await utils.sleep(0);

        // Find grade 1
        await waitFor(() => {
            expect(foundFrom).toBeTruthy();
            expect(screen.queryAllByText(/System Values/i).length).toBeTruthy();
        });

        await fireEvent.click(foundFrom as HTMLElement);

        await utils.sleep(0);
        const grade1Found = await getAllByText(/Grade 1/i);

        // Grade 1 should be chosen.
        await waitFor(() => {
            expect(grade1Found.length).toEqual(1);
            expect(screen.queryAllByText(/System Values/i).length).toBeFalsy();
        });

        await fireEvent.mouseDown(pTo);
        await utils.sleep(0);
        const foundTo = screen.queryByText(/Grade 2/i);

        await waitFor(() => {
            expect(foundTo).toBeTruthy();
            expect(screen.queryAllByText(/System Values/i).length).toBeTruthy();
        });

        await fireEvent.click(foundTo as HTMLElement);

        await utils.sleep(0);
        const grade2Found = await getAllByText(/Grade 2/i);

        await waitFor(() => {
            expect(grade2Found.length).toEqual(1);
            expect(screen.queryAllByText(/System Values/i).length).toBeFalsy();
        });
    });
});
