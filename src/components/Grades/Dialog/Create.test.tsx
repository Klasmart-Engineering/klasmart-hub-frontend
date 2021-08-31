import CreateGrade from './Create';
import { MockedResponse } from '@apollo/client/testing';
import {
    act,
    waitFor,
} from '@testing-library/react';
import { mockOrgId } from '@tests/mockDataGrades';
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

const mocks: MockedResponse[] = [];

test(`Create grade dialog renders correctly and with empty fields.`, async () => {
    const { queryByLabelText, queryByText } = render(<CreateGrade
        open={true}
        onClose={jest.fn()}/>, {
        mockedResponses: mocks,
    });

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
