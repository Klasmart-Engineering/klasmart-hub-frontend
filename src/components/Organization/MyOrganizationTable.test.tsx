import 'regenerator-runtime/runtime';
import MyOrganizationTable from './MyOrganizationTable';
import { GET_ORGANIZATION_OWNERSHIPS } from "@/operations/queries/getMyOrganization";
import { getLanguage } from "@/utils/locale";
import { MockedResponse } from '@apollo/client/testing';
import {
    act,
    screen,
    waitFor,
} from '@testing-library/react';
import {
    mockOrgId,
    mockOrgStack,
} from '@tests/mockOrganizationData';
import qlRender from '@tests/utils';
import { utils } from 'kidsloop-px';
import React from 'react';

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_ORGANIZATION_OWNERSHIPS,
        },
        result: {
            data: {
                me: {
                    organization_ownerships: [ mockOrgStack[0] ],
                    user_id: `f6d5a6e2-ebb2-5b0b-836d-2731b2594500`,
                    user_name: `Joe Schmoe`,
                },
            },
        },
    },
];

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            organization_id: mockOrgId,
        }),
        useCurrentOrganizationMembership: () => ({
            organization_id: mockOrgId,
        }),
        useOrganizationStack: () => ([ mockOrgStack[0] ]),
    };
});

jest.mock(`@/utils/checkAllowed`, () => {
    return {
        ...jest.requireActual(`@/utils/checkAllowed`),
        usePermission: () => true,
    };
});

test(`MyOrganizationTable renders correctly`, async () => {
    const locale = getLanguage(`en`);
    const { findByText, findAllByText } = qlRender(mocks, locale, <MyOrganizationTable />);

    await act(async () => {
        const title = await findByText(`My Organizations`);
        const name = await findAllByText(`Organization Name`);
        const phone = await findAllByText(`Phone Number`);
        const email = await findAllByText(`Email`);
        const roles = await findAllByText(`Role(s)`);
        const status = await findAllByText(`Status`);

        await waitFor(() => {
            expect(title).toBeTruthy();
            expect(name.length).toBeTruthy();
            expect(phone.length).toBeTruthy();
            expect(email.length).toBeTruthy();
            expect(roles.length).toBeTruthy();
            expect(status.length).toBeTruthy();
        });
    });
});

test(`MyOrganizationTable renders correct data`, async () => {
    const locale = getLanguage(`en`);
    const { findByText } = qlRender(mocks, locale, <MyOrganizationTable />);

    await act(async () => {
        const orgName = await findByText(`KidsLoop Miracle Squad`);
        const orgPhone = await findByText(`1112223344`);
        const ownerEmail = await findByText(`test@testing.com`);
        const role1 = await findByText(`Organization Admin`);
        const role2 = await findByText(`School Admin`);
        const status = await findByText(`Active`);

        await waitFor(async () => {
            expect(orgName).toBeTruthy();
            expect(orgPhone).toBeTruthy();
            expect(ownerEmail).toBeTruthy();
            expect(role1).toBeTruthy();
            expect(role2).toBeTruthy();
            expect(status).toBeTruthy();
        });
    });
});
