import CreateGrade from './Create';
import { getLanguage } from "@/utils/locale";
import { MockedResponse } from '@apollo/client/testing';
import {
    act,
    waitFor,
} from '@testing-library/react';
import { mockOrgId } from '@tests/mockDataGrades';
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

jest.mock(`@/utils/checkAllowed`, () => {
    return {
        ...jest.requireActual(`@/utils/checkAllowed`),
        usePermission: () => true,
    };
});

const mocks: MockedResponse[] = [];

test(`Create grade dialog renders correctly and with empty fields.`, async () => {
    const locale = getLanguage(`en`);
    const { getByLabelText, getByText } = qlRender(mocks, locale, <CreateGrade
        open={true}
        onClose={jest.fn()}/>);

    await act(async () => {
        const title = await getByText(`Create Grade`);
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
