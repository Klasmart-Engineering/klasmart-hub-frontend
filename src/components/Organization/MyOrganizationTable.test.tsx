import 'regenerator-runtime/runtime';
import MyOrganizationTable from './MyOrganizationTable';
import { GET_ORGANIZATION_OWNERSHIPS } from "@/operations/queries/getMyOrganization";
import { MockedResponse } from '@apollo/client/testing';
import {
    act,
    waitFor,
} from '@testing-library/react';
import {
    mockOrgId,
    mockOrgStack,
} from '@tests/mockOrganizationData';
import { render } from "@tests/utils/render";
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

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

test(`MyOrganizationTable renders correctly`, async () => {
    const { findByText, findAllByText } = render(<MyOrganizationTable />, {
        mockedResponses: mocks,
    });

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
    const { findByText } = render(<MyOrganizationTable />, {
        mockedResponses: mocks,
    });

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
