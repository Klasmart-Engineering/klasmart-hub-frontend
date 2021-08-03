import EditGrade from './Edit';
import { GET_GRADE } from '@/operations/queries/getGrade';
import { GET_GRADES } from '@/operations/queries/getGrades';
import { getLanguage } from "@/utils/locale";
import { MockedResponse } from '@apollo/client/testing';
import {
    act,
    waitFor,
} from '@testing-library/react';
import {
    grade2Id,
    grades,
    mockGrade,
    mockOrgId,
} from '@tests/mockDataGrades';
import qlRender from '@tests/utils';
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

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_GRADE,
            variables: {
                id: grade2Id,
            },
        },
        result: {
            data: {
                grade: mockGrade,
            },
        },
    },
];

test(`Edit grade dialog renders correctly`, async () => {
    const locale = getLanguage(`en`);
    const { getByLabelText, getByText } = qlRender(mocks, locale, <EditGrade
        gradeId={grade2Id}
        open={true}
        onClose={jest.fn()}/>);

    await act(async () => {
        const title = await getByText(`Edit Grade`);
        const name = await getByLabelText(`Grade Name`);
        const pFrom = await getByLabelText(`Progress From`);
        const pTo = await getByLabelText(`Progress To`);

        await waitFor(() => {
            expect(title).toBeTruthy();
            expect(name).toBeTruthy();
            expect(pFrom).toBeTruthy();
            expect(pTo).toBeTruthy();
        });

    });
});

test(`Edit grade dialog renders correctly with correct data`, async () => {
    const locale = getLanguage(`en`);

    await act(async () => {
        const { queryByLabelText } = qlRender(mocks, locale, <EditGrade
            gradeId={grade2Id}
            open={true}
            onClose={jest.fn()}/>);

        await waitFor(() => {
            expect(queryByLabelText(`Grade Name`, {
                selector: `input`,
            })?.value).toBe(`Grade 2`);
        });

    });
});
