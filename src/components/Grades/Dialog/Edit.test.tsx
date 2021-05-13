import EditGrade from './Edit';
import { GET_GRADES } from '@/operations/queries/getGrades';
import { getLanguage } from "@/utils/locale";
import { MockedResponse } from '@apollo/client/testing';
import {
    act,
    screen,
    waitFor,
} from '@testing-library/react';
import {
    grades,
    mockGrade,
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

jest.mock(`@/utils/checkAllowed`, () => {
    return {
        ...jest.requireActual(`@/utils/checkAllowed`),
        usePermission: () => true,
    };
});

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

test(`Edit grade dialog renders correctly`, async () => {
    const locale = getLanguage(`en`);
    const { getByLabelText, getByText } = qlRender(mocks, locale, <EditGrade
        value={mockGrade}
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
        const { getByLabelText } = qlRender(mocks, locale, <EditGrade
            value={mockGrade}
            open={true}
            onClose={jest.fn()}/>);

        await utils.sleep(100);
        const name = await getByLabelText(`Grade Name`, {
            selector: `input`,
        });

        const grade1Found = await screen.queryAllByText(/grade 1/gi);
        const grade3Found = await screen.queryAllByText(/grade 3/gi);

        await waitFor(() => {
            expect(name.value).toBe(`Grade 2`);
            expect(grade1Found.length).toEqual(1);
            expect(grade3Found.length).toEqual(1);
        });

    });
});
