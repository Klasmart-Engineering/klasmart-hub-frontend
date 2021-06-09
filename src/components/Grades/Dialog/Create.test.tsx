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
    const { queryByLabelText, queryByText } = qlRender(mocks, locale, <CreateGrade
        open={true}
        onClose={jest.fn()}/>);

    await act(async () => {
        const title = queryByText(`Create Grade`);
        const name = queryByLabelText(`Grade Name`);
        const pFrom = queryByLabelText(`Progress From`);
        const pTo = queryByLabelText(`Progress To`);

        waitFor(() => {
            expect(title).toBeTruthy();
            expect(name).toBeTruthy();
            expect(pFrom).toBeTruthy();
            expect(pTo).toBeTruthy();
        });

    });
});
